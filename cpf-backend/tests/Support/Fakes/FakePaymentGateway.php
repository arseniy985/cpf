<?php

namespace Tests\Support\Fakes;

use App\Models\User;
use App\Modules\Payments\Contracts\PaymentGateway;
use App\Modules\Payments\Data\PaymentStatusData;
use App\Modules\Payments\Data\PaymentTransactionData;
use App\Modules\Payments\Domain\Models\PaymentTransaction;

class FakePaymentGateway implements PaymentGateway
{
    public function createDeposit(User $user, int $amount, string $idempotenceKey): PaymentTransactionData
    {
        $transaction = PaymentTransaction::query()->create([
            'user_id' => $user->id,
            'gateway' => 'yookassa',
            'type' => 'deposit',
            'status' => 'pending',
            'amount' => $amount,
            'currency' => 'RUB',
            'external_id' => sprintf('fake-%s-%s', $user->id, $idempotenceKey),
            'idempotency_key' => $idempotenceKey,
            'confirmation_url' => 'https://yookassa.test/confirm/'.$idempotenceKey,
            'payload' => [
                'fake' => true,
                'idempotence_key' => $idempotenceKey,
            ],
        ]);

        return PaymentTransactionData::fromModel($transaction);
    }

    public function fetchPaymentStatus(string $externalId): PaymentStatusData
    {
        return new PaymentStatusData(
            externalId: $externalId,
            status: 'paid',
            confirmationUrl: 'https://yookassa.test/paid/'.$externalId,
            statusReason: null,
            payload: ['fake' => true, 'external_id' => $externalId],
        );
    }
}
