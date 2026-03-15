<?php

namespace App\Modules\Payments\Contracts;

use App\Modules\Payments\Domain\Models\PayoutInstruction;

interface PayoutGateway
{
    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    public function createInvestorPayout(PayoutInstruction $instruction, array $payload): array;

    /**
     * @return array<string, mixed>
     */
    public function fetchPayoutStatus(string $externalId): array;
}
