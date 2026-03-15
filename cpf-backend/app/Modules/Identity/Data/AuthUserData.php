<?php

namespace App\Modules\Identity\Data;

use App\Models\User;
use App\Modules\Origination\Data\OwnerAccountSummaryData;
use App\Modules\Payments\Data\InvestorPayoutProfileData;
use Spatie\LaravelData\Data;

class AuthUserData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
        public ?string $phone,
        public ?string $emailVerifiedAt,
        public ?string $kycStatus,
        /** @var array<int, string> */
        public array $roles,
        public ?OwnerAccountSummaryData $ownerAccount,
        public ?InvestorPayoutProfileData $investorPayoutProfile,
    ) {}

    public static function fromModel(User $user): self
    {
        $ownerAccount = $user->relationLoaded('ownerMemberships')
            ? $user->ownerMemberships->first()?->ownerAccount
            : $user->ownerMemberships()->with('ownerAccount')->first()?->ownerAccount;

        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            phone: $user->phone,
            emailVerifiedAt: $user->email_verified_at?->toAtomString(),
            kycStatus: $user->kycProfile?->status,
            roles: $user->getRoleNames()->values()->all(),
            ownerAccount: OwnerAccountSummaryData::fromModel($ownerAccount),
            investorPayoutProfile: InvestorPayoutProfileData::fromModel(
                $user->relationLoaded('investorPayoutProfile')
                    ? $user->investorPayoutProfile
                    : $user->investorPayoutProfile()->first()
            ),
        );
    }
}
