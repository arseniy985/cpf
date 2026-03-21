<?php

namespace App\Modules\Origination\Services;

use App\Models\User;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Origination\Domain\Models\OfferingRound;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class OfferingRoundService
{
    public function __construct(
        private readonly OwnerAccountProvisioner $provisioner,
    ) {}

    /**
     * @return Collection<int, OfferingRound>
     */
    public function listForOwner(User $user): Collection
    {
        $account = $this->provisioner->ensureForUser($user);

        return OfferingRound::query()
            ->where('owner_account_id', $account->id)
            ->with(['project', 'allocations', 'distributions'])
            ->latest()
            ->get();
    }

    public function create(User $user, array $payload): OfferingRound
    {
        $account = $this->provisioner->ensureForUser($user);
        $project = $this->resolveProject($user, $payload['project_id']);

        return OfferingRound::query()->create([
            ...$payload,
            'project_id' => $project->id,
            'owner_account_id' => $account->id,
            'status' => 'draft',
            'current_amount' => 0,
            'oversubscription_allowed' => (bool) ($payload['oversubscription_allowed'] ?? false),
        ]);
    }

    public function update(User $user, OfferingRound $round, array $payload): OfferingRound
    {
        $this->assertOwnership($user, $round);

        $round->fill($payload);
        $round->save();

        return $round->fresh(['project', 'allocations', 'distributions']);
    }

    public function submitReview(User $user, OfferingRound $round): OfferingRound
    {
        $this->assertOwnership($user, $round);

        $round->forceFill([
            'status' => 'pending_review',
            'review_submitted_at' => now(),
        ])->save();

        return $round->fresh(['project', 'allocations', 'distributions']);
    }

    public function goLive(User $user, OfferingRound $round): OfferingRound
    {
        $this->assertOwnership($user, $round);
        $round->loadMissing('project', 'ownerAccount.onboarding');

        return $this->publishRound($round);
    }

    public function goLiveAsAdmin(OfferingRound $round): OfferingRound
    {
        $round->loadMissing('project', 'ownerAccount.onboarding');

        return $this->publishRound($round);
    }

    public function close(User $user, OfferingRound $round): OfferingRound
    {
        $this->assertOwnership($user, $round);

        return $this->closeAsAdmin($round);
    }

    public function closeAsAdmin(OfferingRound $round): OfferingRound
    {
        return $this->finalizeClose($round);
    }

    public function ensureAcceptingRound(Project $project): ?OfferingRound
    {
        return $project->offeringRounds()
            ->where('status', 'live')
            ->orderByDesc('went_live_at')
            ->orderByDesc('created_at')
            ->first();
    }

    public function registerConfirmedAmount(OfferingRound $round, int $amount): void
    {
        $round->refresh();
        $round->increment('current_amount', $amount);
        $round->refresh();

        if (! $round->oversubscription_allowed && $round->current_amount >= $round->target_amount) {
            $round->forceFill(['status' => 'fully_allocated'])->save();
        }
    }

    public function canConfirmAmount(OfferingRound $round, int $amount): bool
    {
        if ($round->oversubscription_allowed) {
            return true;
        }

        return ($round->current_amount + $amount) <= $round->target_amount;
    }

    private function resolveProject(User $user, string $projectId): Project
    {
        return $user->ownedProjects()->whereKey($projectId)->firstOrFail();
    }

    private function assertOwnership(User $user, OfferingRound $round): void
    {
        abort_unless($round->ownerAccount->members()->where('user_id', $user->id)->exists(), 404);
    }

    private function publishRound(OfferingRound $round): OfferingRound
    {
        if (! in_array($round->status, ['pending_review', 'ready'], true)) {
            throw ValidationException::withMessages([
                'round' => ['Открыть сбор можно только после отправки раунда на проверку.'],
            ]);
        }

        if ($round->project?->status !== 'published') {
            throw ValidationException::withMessages([
                'project' => ['Открыть сбор можно только для опубликованного проекта.'],
            ]);
        }

        if (! in_array($round->ownerAccount?->onboarding?->status, ['kyb_approved', 'active'], true)) {
            throw ValidationException::withMessages([
                'owner' => ['Профиль компании должен быть одобрен перед запуском сбора.'],
            ]);
        }

        $round->forceFill([
            'status' => 'live',
            'opens_at' => $round->opens_at ?: now(),
            'went_live_at' => now(),
        ])->save();

        return $round->fresh(['project', 'allocations', 'distributions']);
    }

    private function finalizeClose(OfferingRound $round): OfferingRound
    {
        if (! in_array($round->status, ['live', 'fully_allocated'], true)) {
            throw ValidationException::withMessages([
                'round' => ['Закрыть можно только активный или полностью заполненный раунд.'],
            ]);
        }

        $round->forceFill([
            'status' => 'closed',
            'closes_at' => $round->closes_at ?: now(),
            'closed_at' => now(),
        ])->save();

        return $round->fresh(['project', 'allocations', 'distributions']);
    }
}
