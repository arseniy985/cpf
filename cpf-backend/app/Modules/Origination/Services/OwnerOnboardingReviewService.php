<?php

namespace App\Modules\Origination\Services;

use App\Modules\Origination\Domain\Models\OwnerOnboarding;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OwnerOnboardingReviewService
{
    public function approve(OwnerOnboarding $onboarding): OwnerOnboarding
    {
        return DB::transaction(function () use ($onboarding): OwnerOnboarding {
            $onboarding->loadMissing('ownerAccount.primaryUser');

            $onboarding->forceFill([
                'status' => 'kyb_approved',
                'reviewed_at' => now(),
                'rejection_reason' => null,
            ])->save();

            $onboarding->ownerAccount?->forceFill([
                'status' => 'kyb_approved',
            ])->save();

            return $onboarding->fresh(['ownerAccount.primaryUser']);
        });
    }

    public function activate(OwnerOnboarding $onboarding): OwnerOnboarding
    {
        if (! in_array($onboarding->status, ['kyb_approved', 'active'], true)) {
            throw ValidationException::withMessages([
                'status' => ['Активировать можно только одобренный профиль компании.'],
            ]);
        }

        return DB::transaction(function () use ($onboarding): OwnerOnboarding {
            $onboarding->loadMissing('ownerAccount.primaryUser');

            $onboarding->forceFill([
                'status' => 'active',
                'reviewed_at' => $onboarding->reviewed_at ?: now(),
                'activated_at' => now(),
                'rejection_reason' => null,
            ])->save();

            $onboarding->ownerAccount?->forceFill([
                'status' => 'active',
            ])->save();

            return $onboarding->fresh(['ownerAccount.primaryUser']);
        });
    }

    public function reject(OwnerOnboarding $onboarding, string $reason): OwnerOnboarding
    {
        return DB::transaction(function () use ($onboarding, $reason): OwnerOnboarding {
            $onboarding->loadMissing('ownerAccount.primaryUser');

            $onboarding->forceFill([
                'status' => 'kyb_rejected',
                'reviewed_at' => now(),
                'activated_at' => null,
                'rejection_reason' => $reason,
            ])->save();

            $onboarding->ownerAccount?->forceFill([
                'status' => 'kyb_rejected',
            ])->save();

            return $onboarding->fresh(['ownerAccount.primaryUser']);
        });
    }
}
