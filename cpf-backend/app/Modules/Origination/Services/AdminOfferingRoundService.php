<?php

namespace App\Modules\Origination\Services;

use App\Modules\Origination\Domain\Models\OfferingRound;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdminOfferingRoundService
{
    public function __construct(
        private readonly OfferingRoundService $offeringRoundService,
    ) {}

    public function markReady(OfferingRound $round): OfferingRound
    {
        if (! in_array($round->status, ['draft', 'pending_review', 'revision_requested'], true)) {
            throw ValidationException::withMessages([
                'status' => ['Перевести раунд в статус "Готово" можно только из черновика или проверки.'],
            ]);
        }

        return DB::transaction(function () use ($round): OfferingRound {
            $round->forceFill([
                'status' => 'ready',
                'review_submitted_at' => $round->review_submitted_at ?: now(),
            ])->save();

            return $round->fresh(['project', 'ownerAccount.onboarding']);
        });
    }

    public function requestRevision(OfferingRound $round, string $reason): OfferingRound
    {
        if (in_array($round->status, ['live', 'fully_allocated', 'closed'], true)) {
            throw ValidationException::withMessages([
                'status' => ['Активный или закрытый раунд нельзя вернуть на доработку.'],
            ]);
        }

        return DB::transaction(function () use ($round, $reason): OfferingRound {
            $round->forceFill([
                'status' => 'revision_requested',
                'notes' => $this->appendNote($round->notes, sprintf('Возвращено на доработку: %s', $reason)),
            ])->save();

            return $round->fresh(['project', 'ownerAccount.onboarding']);
        });
    }

    public function goLive(OfferingRound $round): OfferingRound
    {
        return $this->offeringRoundService->goLiveAsAdmin($round);
    }

    public function close(OfferingRound $round): OfferingRound
    {
        return $this->offeringRoundService->closeAsAdmin($round);
    }

    private function appendNote(?string $existing, string $note): string
    {
        $existing = trim((string) $existing);

        if ($existing === '') {
            return $note;
        }

        return $existing."\n\n".$note;
    }
}
