<?php

namespace App\Modules\Identity\Services;

use App\Models\User;
use App\Modules\Identity\Enums\RegistrationAccountType;
use App\Modules\Origination\Services\OwnerEnrollmentService;
use Illuminate\Support\Facades\DB;

class RegistrationService
{
    public function __construct(
        private readonly OwnerEnrollmentService $ownerEnrollmentService,
    ) {}

    /**
     * @param  array{name:string,email:string,phone:?string,password:string}  $attributes
     */
    public function register(array $attributes, RegistrationAccountType $accountType): User
    {
        return DB::transaction(function () use ($attributes, $accountType): User {
            $user = User::query()->create($attributes);

            if ($accountType === RegistrationAccountType::Owner) {
                return $this->ownerEnrollmentService->enroll($user);
            }

            $user->assignRole('investor');

            return $user->load('kycProfile');
        });
    }
}
