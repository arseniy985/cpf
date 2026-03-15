<?php

namespace App\Modules\Origination\Services;

use App\Models\User;
use App\Modules\Origination\Domain\Models\OwnerAccount;
use App\Modules\Origination\Domain\Models\OwnerBankProfile;
use App\Modules\Origination\Domain\Models\OwnerMember;
use App\Modules\Origination\Domain\Models\OwnerOnboarding;
use App\Modules\Origination\Domain\Models\OwnerOrganization;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OwnerAccountProvisioner
{
    public function ensureForUser(User $user): OwnerAccount
    {
        $existing = OwnerAccount::query()
            ->whereHas('members', fn ($query) => $query->where('user_id', $user->id))
            ->with(['organization', 'bankProfile', 'onboarding', 'members'])
            ->first();

        if ($existing) {
            $this->syncOwnedProjects($user, $existing);

            return $existing;
        }

        return DB::transaction(function () use ($user): OwnerAccount {
            $account = OwnerAccount::query()->create([
                'primary_user_id' => $user->id,
                'slug' => $this->generateUniqueSlug($user),
                'display_name' => $user->name,
                'status' => 'account_created',
            ]);

            OwnerMember::query()->create([
                'owner_account_id' => $account->id,
                'user_id' => $user->id,
                'role' => 'owner',
                'status' => 'active',
            ]);

            OwnerOrganization::query()->create([
                'owner_account_id' => $account->id,
            ]);

            OwnerBankProfile::query()->create([
                'owner_account_id' => $account->id,
                'status' => 'draft',
            ]);

            OwnerOnboarding::query()->create([
                'owner_account_id' => $account->id,
                'status' => 'account_created',
                'account_created_at' => now(),
            ]);

            $this->syncOwnedProjects($user, $account);

            return $account->load(['organization', 'bankProfile', 'onboarding', 'members']);
        });
    }

    private function generateUniqueSlug(User $user): string
    {
        $base = Str::slug($user->name !== '' ? $user->name : Str::before($user->email, '@'));
        $base = $base !== '' ? $base : 'owner-account';
        $candidate = $base;
        $suffix = 2;

        while (OwnerAccount::query()->where('slug', $candidate)->exists()) {
            $candidate = sprintf('%s-%d', $base, $suffix);
            $suffix++;
        }

        return $candidate;
    }

    private function syncOwnedProjects(User $user, OwnerAccount $account): void
    {
        $user->ownedProjects()
            ->whereNull('owner_account_id')
            ->update(['owner_account_id' => $account->id]);
    }
}
