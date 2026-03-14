<?php

namespace App\Modules\Payments\Data;

use App\Modules\Payments\Domain\Models\PaymentTransaction;
use Spatie\LaravelData\Data;

class PaymentTransactionData extends Data
{
    public function __construct(
        public string $id,
        public string $gateway,
        public string $type,
        public string $status,
        public int $amount,
        public string $currency,
        public ?string $externalId,
        public ?string $confirmationUrl,
    ) {}

    public static function fromModel(PaymentTransaction $transaction): self
    {
        return new self(
            id: $transaction->id,
            gateway: $transaction->gateway,
            type: $transaction->type,
            status: $transaction->status,
            amount: $transaction->amount,
            currency: $transaction->currency,
            externalId: $transaction->external_id,
            confirmationUrl: $transaction->confirmation_url,
        );
    }
}
