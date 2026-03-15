<?php

namespace App\Modules\Origination\Data;

use App\Modules\Origination\Domain\Models\OwnerAccount;
use Spatie\LaravelData\Data;

class OwnerAccountSummaryData extends Data
{
    public function __construct(
        public string $id,
        public string $slug,
        public string $displayName,
        public string $status,
    ) {}

    public static function fromModel(?OwnerAccount $account): ?self
    {
        if ($account === null) {
            return null;
        }

        return new self(
            id: $account->id,
            slug: $account->slug,
            displayName: $account->display_name,
            status: $account->status,
        );
    }
}
