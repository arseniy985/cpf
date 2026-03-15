<?php

namespace App\Modules\Payments\Services;

use App\Modules\Payments\Contracts\PayoutGateway;
use App\Modules\Payments\Domain\Models\PayoutInstruction;
use YooKassa\Client;

class YooKassaPayoutGateway implements PayoutGateway
{
    public function createInvestorPayout(PayoutInstruction $instruction, array $payload): array
    {
        $payout = $this->makeClient()->createPayout([
            'amount' => [
                'value' => number_format($instruction->amount, 2, '.', ''),
                'currency' => $instruction->currency,
            ],
            'payout_token' => $payload['payout_token'] ?? null,
            'description' => $instruction->reference_label ?: sprintf('Выплата инвестору %s', $instruction->user?->email),
            'metadata' => [
                'instruction_id' => $instruction->id,
                'distribution_id' => $instruction->distribution_id,
            ],
        ], $instruction->id);

        return $payout->jsonSerialize();
    }

    public function fetchPayoutStatus(string $externalId): array
    {
        return $this->makeClient()->getPayoutInfo($externalId)->jsonSerialize();
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
