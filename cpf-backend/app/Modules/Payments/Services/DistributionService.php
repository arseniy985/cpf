<?php

namespace App\Modules\Payments\Services;

use App\Modules\Payments\Contracts\PayoutGateway;
use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Payments\Domain\Models\Distribution;
use App\Modules\Payments\Domain\Models\DistributionLine;
use App\Modules\Payments\Domain\Models\PayoutInstruction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class DistributionService
{
    public function __construct(
        private readonly PayoutGateway $payoutGateway,
    ) {}

    public function createForRound(OfferingRound $round, array $payload): Distribution
    {
        $allocations = $round->allocations()->where('status', 'confirmed')->get();

        if ($allocations->isEmpty()) {
            throw ValidationException::withMessages([
                'round' => ['Нельзя сформировать распределение без подтвержденных аллокаций.'],
            ]);
        }

        return DB::transaction(function () use ($round, $payload, $allocations): Distribution {
            $distribution = Distribution::query()->create([
                ...$payload,
                'offering_round_id' => $round->id,
                'project_id' => $round->project_id,
                'owner_account_id' => $round->owner_account_id,
                'status' => 'draft',
                'lines_count' => $allocations->count(),
            ]);

            $totalAllocation = max(1, (int) $allocations->sum('amount'));
            $remaining = (int) $payload['total_amount'];

            foreach ($allocations->values() as $index => $allocation) {
                $isLast = $index === ($allocations->count() - 1);
                $lineAmount = $isLast
                    ? $remaining
                    : (int) floor(($allocation->amount / $totalAllocation) * (int) $payload['total_amount']);

                $remaining -= $lineAmount;

                DistributionLine::query()->create([
                    'distribution_id' => $distribution->id,
                    'investor_allocation_id' => $allocation->id,
                    'user_id' => $allocation->user_id,
                    'amount' => max(0, $lineAmount),
                    'status' => 'draft',
                ]);
            }

            return $distribution->fresh([
                'round',
                'lines.allocation.round',
                'lines.allocation.project',
                'lines.allocation.user',
                'lines.payoutInstruction',
            ]);
        });
    }

    public function approve(Distribution $distribution): Distribution
    {
        if ($distribution->status !== 'draft') {
            throw ValidationException::withMessages([
                'distribution' => ['Согласовать можно только черновик реестра.'],
            ]);
        }

        DB::transaction(function () use ($distribution): void {
            $distribution->forceFill([
                'status' => 'approved_for_payout',
                'approved_at' => now(),
            ])->save();

            $distribution->lines()->update(['status' => 'ready']);
        });

        return $distribution->fresh([
            'round',
            'lines.allocation.round',
            'lines.allocation.project',
            'lines.allocation.user',
            'lines.payoutInstruction',
        ]);
    }

    public function dispatch(Distribution $distribution): Distribution
    {
        $instructionIds = DB::transaction(function () use ($distribution): array {
            $lockedDistribution = Distribution::query()
                ->whereKey($distribution->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (! in_array($lockedDistribution->status, ['approved_for_payout', 'processing'], true)) {
                throw ValidationException::withMessages([
                    'distribution' => ['Запуск выплат доступен только для согласованного реестра.'],
                ]);
            }

            $instructionIds = [];
            $lines = $lockedDistribution->lines()
                ->with(['payoutInstruction', 'user.investorPayoutProfile'])
                ->lockForUpdate()
                ->get();

            foreach ($lines as $line) {
                if ($line->status === 'paid') {
                    continue;
                }

                $instruction = $line->payoutInstruction ?: PayoutInstruction::query()->create([
                    'distribution_id' => $lockedDistribution->id,
                    'user_id' => $line->user_id,
                    'amount' => $line->amount,
                    'currency' => 'RUB',
                    'direction' => 'investor_distribution',
                    'gateway' => $lockedDistribution->payout_mode === 'yookassa' ? 'yookassa_payout' : 'manual',
                    'status' => 'draft',
                    'reference_label' => sprintf('%s · %s', $lockedDistribution->title, $line->user?->email ?: $line->id),
                ]);

                if (! $line->payout_instruction_id) {
                    $line->forceFill(['payout_instruction_id' => $instruction->id])->save();
                }

                if ($line->status === 'ready') {
                    $line->forceFill(['status' => 'pending_payout'])->save();
                }

                $instructionIds[] = $instruction->id;
            }

            $lockedDistribution->forceFill([
                'status' => 'processing',
                'processed_at' => now(),
            ])->save();

            return $instructionIds;
        });

        foreach ($instructionIds as $instructionId) {
            $this->dispatchInstructionById($instructionId);
        }

        $this->syncDistributionStatus($distribution->id);

        return $distribution->fresh([
            'round',
            'lines.allocation.round',
            'lines.allocation.project',
            'lines.allocation.user',
            'lines.payoutInstruction',
        ]);
    }

    private function dispatchInstructionById(string $instructionId): void
    {
        $instruction = PayoutInstruction::query()
            ->with(['distribution', 'distributionLine', 'user.investorPayoutProfile'])
            ->findOrFail($instructionId);

        $distribution = $instruction->distribution;
        $line = $instruction->distributionLine;

        if (! $distribution || ! $line || in_array($instruction->status, ['succeeded', 'paid'], true)) {
            return;
        }

        $payload = $instruction->payload ?? [];
        $payoutToken = $instruction->user?->investorPayoutProfile?->payout_token
            ?? $payload['payout_token']
            ?? null;

        if ($distribution->payout_mode !== 'yookassa' || ! config('payments.yookassa.payouts_enabled') || ! $payoutToken) {
            $this->markInstructionAsManual($instruction, $line, $distribution);
            return;
        }

        $response = $this->payoutGateway->createInvestorPayout($instruction->loadMissing('user'), [
            'payout_token' => $payoutToken,
        ]);

        DB::transaction(function () use ($instruction, $line, $response): void {
            $lockedInstruction = PayoutInstruction::query()
                ->whereKey($instruction->id)
                ->lockForUpdate()
                ->firstOrFail();
            $lockedLine = DistributionLine::query()
                ->whereKey($line->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (in_array($lockedInstruction->status, ['succeeded', 'paid'], true) || $lockedLine->status === 'paid') {
                return;
            }

            $lockedInstruction->forceFill([
                'status' => $response['status'] ?? 'processing',
                'external_id' => $response['id'] ?? null,
                'payload' => $response,
                'failure_reason' => $this->extractFailureReason($response),
                'processed_at' => now(),
            ])->save();

            if (($response['status'] ?? null) === 'succeeded') {
                $lockedLine->forceFill([
                    'status' => 'paid',
                    'failure_reason' => null,
                    'paid_at' => now(),
                ])->save();

                return;
            }

            $lockedLine->forceFill([
                'status' => 'pending_payout',
                'failure_reason' => $this->extractFailureReason($response),
            ])->save();
        });
    }

    public function syncPendingPayouts(int $limit = 100): int
    {
        $instructions = PayoutInstruction::query()
            ->with(['distribution', 'distributionLine'])
            ->where('gateway', '!=', 'manual')
            ->whereNotNull('external_id')
            ->whereIn('status', ['pending', 'draft', 'processing'])
            ->oldest('created_at')
            ->limit($limit)
            ->get();

        $synced = 0;

        foreach ($instructions as $instruction) {
            $response = $this->payoutGateway->fetchPayoutStatus((string) $instruction->external_id);
            $this->applyGatewayStatus($instruction->id, $response);
            $synced++;
        }

        return $synced;
    }

    private function markInstructionAsManual(
        PayoutInstruction $instruction,
        DistributionLine $line,
        Distribution $distribution,
    ): void {
        DB::transaction(function () use ($instruction, $line, $distribution): void {
            $lockedInstruction = PayoutInstruction::query()
                ->whereKey($instruction->id)
                ->lockForUpdate()
                ->firstOrFail();
            $lockedLine = DistributionLine::query()
                ->whereKey($line->id)
                ->lockForUpdate()
                ->firstOrFail();

            $lockedInstruction->forceFill([
                'status' => 'manual_required',
                'failure_reason' => $distribution->payout_mode === 'yookassa'
                    ? 'Автоматическую выплату запустить не удалось. Нужны реквизиты получателя.'
                    : 'Выплата добавлена в очередь для ручной обработки.',
                'processed_at' => now(),
            ])->save();

            $lockedLine->forceFill([
                'status' => 'pending_payout',
                'failure_reason' => $lockedInstruction->failure_reason,
            ])->save();
        });
    }

    /**
     * @param  array<string, mixed>  $response
     */
    private function applyGatewayStatus(string $instructionId, array $response): void
    {
        DB::transaction(function () use ($instructionId, $response): void {
            $instruction = PayoutInstruction::query()
                ->whereKey($instructionId)
                ->lockForUpdate()
                ->firstOrFail();
            $line = $instruction->distributionLine()
                ->lockForUpdate()
                ->firstOrFail();

            $status = (string) ($response['status'] ?? 'processing');
            $failureReason = $this->extractFailureReason($response);

            $instruction->forceFill([
                'status' => $status,
                'payload' => $response,
                'failure_reason' => $failureReason,
                'processed_at' => now(),
            ])->save();

            if ($status === 'succeeded') {
                $line->forceFill([
                    'status' => 'paid',
                    'failure_reason' => null,
                    'paid_at' => now(),
                ])->save();
            } elseif (in_array($status, ['canceled', 'failed'], true)) {
                $line->forceFill([
                    'status' => 'pending_payout',
                    'failure_reason' => $failureReason ?: 'Автоматическая выплата не завершилась. Проверьте очередь выплат.',
                ])->save();
            } else {
                $line->forceFill([
                    'status' => 'pending_payout',
                    'failure_reason' => null,
                ])->save();
            }

            $this->syncDistributionStatus($instruction->distribution_id);
        });
    }

    private function syncDistributionStatus(string $distributionId): void
    {
        $distribution = Distribution::query()
            ->whereKey($distributionId)
            ->lockForUpdate()
            ->firstOrFail();
        $lines = $distribution->lines()
            ->lockForUpdate()
            ->get();

        $allLinesPaid = $lines->isNotEmpty()
            && $lines->every(static fn (DistributionLine $line): bool => $line->status === 'paid');
        $hasManualRequired = $this->containsInstructionStatus($lines, 'manual_required');

        $distribution->forceFill([
            'status' => $allLinesPaid
                ? 'paid'
                : ($hasManualRequired ? 'approved_for_payout' : 'processing'),
            'paid_at' => $allLinesPaid ? now() : null,
        ])->save();
    }

    /**
     * @param  array<string, mixed>  $response
     */
    private function extractFailureReason(array $response): ?string
    {
        $description = $response['description'] ?? data_get($response, 'cancellation_details.reason');

        return is_string($description) && $description !== '' ? $description : null;
    }

    /**
     * @param  Collection<int, DistributionLine>  $lines
     */
    private function containsInstructionStatus(Collection $lines, string $status): bool
    {
        $instructionIds = $lines
            ->pluck('payout_instruction_id')
            ->filter()
            ->values();

        if ($instructionIds->isEmpty()) {
            return false;
        }

        return PayoutInstruction::query()
            ->whereIn('id', $instructionIds)
            ->where('status', $status)
            ->exists();
    }
}
