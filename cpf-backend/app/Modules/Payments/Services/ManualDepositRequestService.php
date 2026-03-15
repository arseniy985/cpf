<?php

namespace App\Modules\Payments\Services;

use App\Models\User;
use App\Modules\Payments\Domain\Models\ManualDepositRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ManualDepositRequestService
{
    public function __construct(
        private readonly ManualDepositNotificationService $notificationService,
    ) {}

    public function create(User $user, array $attributes, ?string $idempotencyKey = null): ManualDepositRequest
    {
        $request = ManualDepositRequest::query()->create([
            'user_id' => $user->id,
            'amount' => $attributes['amount'],
            'currency' => 'RUB',
            'status' => 'awaiting_transfer',
            'reference_code' => $this->generateReferenceCode(),
            'idempotency_key' => $idempotencyKey,
            'recipient_name' => (string) config('manual_deposits.bank.recipient_name'),
            'bank_name' => (string) config('manual_deposits.bank.bank_name'),
            'bank_account' => (string) config('manual_deposits.bank.bank_account'),
            'bank_bik' => config('manual_deposits.bank.bank_bik'),
            'correspondent_account' => config('manual_deposits.bank.correspondent_account'),
            'payment_purpose' => '',
            'manager_name' => config('manual_deposits.manager.name'),
            'manager_email' => config('manual_deposits.manager.email'),
            'manager_phone' => config('manual_deposits.manager.phone'),
            'manager_telegram' => config('manual_deposits.manager.telegram'),
            'payer_name' => $attributes['payer_name'],
            'payer_bank' => $attributes['payer_bank'] ?? null,
            'payer_account_last4' => $attributes['payer_account_last4'] ?? null,
            'comment' => $attributes['comment'] ?? null,
            'submitted_at' => now(),
            'expires_at' => now()->addHours((int) config('manual_deposits.expires_after_hours', 72)),
        ]);

        $request->forceFill([
            'payment_purpose' => sprintf('Пополнение кошелька, заявка %s', $request->reference_code),
        ])->save();

        $this->notificationService->submitted($request);

        return $request->fresh();
    }

    public function uploadReceipt(ManualDepositRequest $request, UploadedFile $file): ManualDepositRequest
    {
        if (in_array($request->status, ['credited', 'rejected', 'cancelled', 'expired'], true)) {
            return $request;
        }

        $path = $file->store('manual-deposit-receipts/'.$request->id, 'private');

        $request->forceFill([
            'status' => 'under_review',
            'receipt_disk' => 'private',
            'receipt_path' => $path,
            'receipt_original_name' => $file->getClientOriginalName(),
            'receipt_mime_type' => $file->getMimeType(),
            'receipt_size' => $file->getSize(),
            'receipt_uploaded_at' => now(),
        ])->save();

        return $request->fresh();
    }

    public function cancel(ManualDepositRequest $request): ManualDepositRequest
    {
        if (! in_array($request->status, ['awaiting_transfer', 'awaiting_user_clarification'], true)) {
            return $request;
        }

        $request->forceFill([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ])->save();

        return $request->fresh();
    }

    public function expireIfStale(ManualDepositRequest $request): ManualDepositRequest
    {
        if (
            $request->expires_at !== null
            && $request->expires_at->isPast()
            && in_array($request->status, ['awaiting_transfer', 'awaiting_user_clarification'], true)
        ) {
            $request->forceFill(['status' => 'expired'])->save();
        }

        return $request->fresh();
    }

    public function expireStaleForUser(User $user): void
    {
        ManualDepositRequest::query()
            ->where('user_id', $user->id)
            ->whereIn('status', ['awaiting_transfer', 'awaiting_user_clarification'])
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->update(['status' => 'expired']);
    }

    public function findExistingRequest(string $userId, ?string $idempotencyKey): ?ManualDepositRequest
    {
        return ManualDepositRequest::query()
            ->where('user_id', $userId)
            ->where('idempotency_key', $idempotencyKey)
            ->first();
    }

    private function generateReferenceCode(): string
    {
        do {
            $code = 'MD-'.Str::upper(Str::random(6));
        } while (ManualDepositRequest::query()->where('reference_code', $code)->exists());

        return $code;
    }
}
