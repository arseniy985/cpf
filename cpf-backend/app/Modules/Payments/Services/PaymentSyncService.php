<?php

namespace App\Modules\Payments\Services;

use App\Modules\Payments\Contracts\PaymentGateway;
use App\Modules\Payments\Domain\Models\PaymentTransaction;

class PaymentSyncService
{
    public function __construct(
        private readonly PaymentGateway $paymentGateway,
        private readonly WalletLedgerService $walletLedgerService,
    ) {}

    public function syncByExternalId(string $externalId): PaymentTransaction
    {
        $transaction = PaymentTransaction::query()
            ->where('external_id', $externalId)
            ->firstOrFail();

        $snapshot = $this->paymentGateway->fetchPaymentStatus($externalId);

        $transaction->forceFill([
            'status' => $snapshot->status,
            'status_reason' => $snapshot->statusReason,
            'confirmation_url' => $snapshot->confirmationUrl,
            'payload' => $snapshot->payload,
            'processed_at' => in_array($snapshot->status, ['succeeded', 'paid'], true) ? now() : $transaction->processed_at,
            'synced_at' => now(),
        ])->save();

        if (
            in_array($snapshot->status, ['succeeded', 'paid'], true)
            && $transaction->user !== null
            && ! $transaction->user->walletTransactions()
                ->where('reference_type', $transaction::class)
                ->where('reference_id', $transaction->id)
                ->where('type', 'deposit')
                ->exists()
        ) {
            $this->walletLedgerService->create(
                user: $transaction->user,
                type: 'deposit',
                direction: 'credit',
                amount: $transaction->amount,
                status: 'posted',
                reference: $transaction,
                description: 'Пополнение баланса через YooKassa',
            );
        }

        return $transaction->fresh();
    }
}
