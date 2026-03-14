<?php

namespace App\Modules\Identity\Data;

use App\Models\User;
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
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            phone: $user->phone,
            emailVerifiedAt: $user->email_verified_at?->toAtomString(),
            kycStatus: $user->kycProfile?->status,
            roles: $user->getRoleNames()->values()->all(),
        );
    }
}
