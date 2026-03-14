<?php

namespace App\Modules\Payments\Services;

use App\Models\User;
use App\Modules\Payments\Contracts\PaymentGateway;
use App\Modules\Payments\Data\PaymentStatusData;
use App\Modules\Payments\Data\PaymentTransactionData;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use YooKassa\Client;

class YooKassaPaymentGateway implements PaymentGateway
{
    public function createDeposit(User $user, int $amount, string $idempotenceKey): PaymentTransactionData
    {
        $client = $this->makeClient();

        $payment = $client->createPayment([
            'amount' => [
                'value' => number_format($amount, 2, '.', ''),
                'currency' => config('payments.yookassa.currency', 'RUB'),
            ],
            'capture' => config('payments.yookassa.capture', true),
            'confirmation' => [
                'type' => 'redirect',
                'return_url' => config('payments.yookassa.return_url'),
            ],
            'description' => sprintf('Пополнение баланса инвестора %s', $user->email),
            'metadata' => [
                'user_id' => $user->id,
                'type' => 'deposit',
            ],
        ], $idempotenceKey);

        $transaction = PaymentTransaction::query()->create([
            'user_id' => $user->id,
            'gateway' => 'yookassa',
            'type' => 'deposit',
            'status' => (string) $payment->getStatus(),
            'amount' => $amount,
            'currency' => config('payments.yookassa.currency', 'RUB'),
            'external_id' => (string) $payment->getId(),
            'idempotency_key' => $idempotenceKey,
            'confirmation_url' => $payment->getConfirmation()?->getConfirmationUrl(),
            'payload' => $payment->jsonSerialize(),
        ]);

        return PaymentTransactionData::fromModel($transaction);
    }

    public function fetchPaymentStatus(string $externalId): PaymentStatusData
    {
        $payment = $this->makeClient()->getPaymentInfo($externalId);

        return new PaymentStatusData(
            externalId: (string) $payment->getId(),
            status: (string) $payment->getStatus(),
            confirmationUrl: $payment->getConfirmation()?->getConfirmationUrl(),
            statusReason: method_exists($payment, 'getPaid') && $payment->getPaid() ? null : null,
            payload: $payment->jsonSerialize(),
        );
    }

    private function makeClient(): Client
    {
        $client = new Client;
        $client->setAuth(
            (string) config('payments.yookassa.shop_id'),
            (string) config('payments.yookassa.secret_key'),
        );

        return $client;
    }
}
