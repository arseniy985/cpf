<?php

namespace App\Modules\Origination\Services;

use App\Models\User;

class OwnerEnrollmentService
{
    public function __construct(
        private readonly OwnerAccountProvisioner $provisioner,
    ) {}

    public function enroll(User $user): User
    {
        if (! $user->hasRole('investor')) {
            $user->assignRole('investor');
        }

        if (! $user->hasRole('project_owner')) {
            $user->assignRole('project_owner');
        }

        $this->provisioner->ensureForUser($user);

        return $user->fresh()?->load('kycProfile') ?? $user->load('kycProfile');
    }
}
