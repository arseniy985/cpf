<?php

namespace App\Modules\Payments\Contracts;

use App\Models\User;
use App\Modules\Payments\Data\PaymentStatusData;
use App\Modules\Payments\Data\PaymentTransactionData;

interface PaymentGateway
{
    public function createDeposit(User $user, int $amount, string $idempotenceKey): PaymentTransactionData;

    public function fetchPaymentStatus(string $externalId): PaymentStatusData;
}
