<?php

namespace App\Modules\Origination\Data;

use App\Modules\Origination\Domain\Models\OwnerAccount;
use Spatie\LaravelData\Data;

class OwnerAccountData extends Data
{
    public function __construct(
        public string $id,
        public string $slug,
        public string $displayName,
        public string $status,
        public ?string $overview,
        public ?string $websiteUrl,
    ) {}

    public static function fromModel(OwnerAccount $account): self
    {
        return new self(
            id: $account->id,
            slug: $account->slug,
            displayName: $account->display_name,
            status: $account->status,
            overview: $account->overview,
            websiteUrl: $account->website_url,
        );
    }
}
