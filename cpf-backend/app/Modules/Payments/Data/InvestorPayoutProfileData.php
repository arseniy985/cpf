<?php

namespace App\Modules\Payments\Data;

use App\Modules\Payments\Domain\Models\InvestorPayoutProfile;
use Spatie\LaravelData\Data;

class InvestorPayoutProfileData extends Data
{
    public function __construct(
        public ?string $id,
        public ?string $provider,
        public ?string $status,
        public ?string $payoutMethodLabel,
        public ?string $lastVerifiedAt,
        public bool $isReady,
    ) {}

    public static function fromModel(?InvestorPayoutProfile $profile): ?self
    {
        if ($profile === null) {
            return null;
        }

        return new self(
            id: $profile->id,
            provider: $profile->provider,
            status: $profile->status,
            payoutMethodLabel: $profile->payout_method_label,
            lastVerifiedAt: $profile->last_verified_at?->toAtomString(),
            isReady: $profile->isReady(),
        );
    }
}
