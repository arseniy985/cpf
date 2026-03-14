<?php

namespace App\Modules\Payments\Data;

use App\Modules\Payments\Domain\Models\WalletTransaction;
use Spatie\LaravelData\Data;

class WalletTransactionData extends Data
{
    public function __construct(
        public string $id,
        public string $type,
        public string $direction,
        public string $status,
        public int $amount,
        public string $currency,
        public ?string $description,
        public string $occurredAt,
    ) {}

    public static function fromModel(WalletTransaction $transaction): self
    {
        return new self(
            id: $transaction->id,
            type: $transaction->type,
            direction: $transaction->direction,
            status: $transaction->status,
            amount: $transaction->amount,
            currency: $transaction->currency,
            description: $transaction->description,
            occurredAt: $transaction->occurred_at->toAtomString(),
        );
    }
}
