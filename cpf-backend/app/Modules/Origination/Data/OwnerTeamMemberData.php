<?php

namespace App\Modules\Origination\Data;

use App\Modules\Origination\Domain\Models\OwnerMember;
use Spatie\LaravelData\Data;

class OwnerTeamMemberData extends Data
{
    public function __construct(
        public string $id,
        public string $role,
        public string $status,
        public ?string $userId,
        public string $name,
        public string $email,
        public ?string $lastLoginAt,
        public ?string $joinedAt,
    ) {}

    public static function fromModel(OwnerMember $member): self
    {
        return new self(
            id: $member->id,
            role: $member->role,
            status: $member->status,
            userId: $member->user?->id,
            name: $member->user?->name ?? 'Пользователь',
            email: $member->user?->email ?? 'email не указан',
            lastLoginAt: $member->user?->last_login_at?->toAtomString(),
            joinedAt: $member->created_at?->toAtomString(),
        );
    }
}
