<?php

namespace App\Modules\Origination\Services;

use App\Models\User;
use App\Modules\Catalog\Data\ProjectData;
use App\Modules\Origination\Data\OwnerActionItemData;
use App\Modules\Origination\Data\OwnerBankProfileData;
use App\Modules\Origination\Data\OwnerChecklistItemData;
use App\Modules\Origination\Data\OwnerOnboardingData;
use App\Modules\Origination\Data\OwnerOrganizationData;
use App\Modules\Origination\Data\OwnerWorkspaceData;
use App\Modules\Origination\Domain\Models\OwnerAccount;
use App\Modules\Origination\Domain\Models\OwnerOnboarding;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class OwnerWorkspaceService
{
    public function __construct(
        private readonly OwnerAccountProvisioner $provisioner,
    ) {}

    public function getWorkspace(User $user): OwnerWorkspaceData
    {
        $account = $this->provisioner->ensureForUser($user)
            ->loadMissing(['organization', 'bankProfile', 'onboarding', 'projects.documents']);

        $checklist = $this->buildChecklist($account);
        $projects = $account->projects()->with(['documents', 'reports'])->latest()->get();

        return new OwnerWorkspaceData(
            account: \App\Modules\Origination\Data\OwnerAccountData::fromModel($account),
            organization: OwnerOrganizationData::fromModel($account->organization),
            bankProfile: OwnerBankProfileData::fromModel($account->bankProfile),
            onboarding: OwnerOnboardingData::fromModel(
                $account->onboarding,
                $checklist,
                $this->canSubmitForReview($checklist),
            ),
            actionItems: $this->buildActionItems($checklist, $projects->count()),
            summary: [
                'projectsCount' => $projects->count(),
                'reviewQueueCount' => $projects->where('status', 'pending_review')->count(),
                'publishedCount' => $projects->where('status', 'published')->count(),
                'totalTargetAmount' => (int) $projects->sum('target_amount'),
                'totalRaisedAmount' => (int) $projects->sum('current_amount'),
            ],
            latestProjects: ProjectData::collect($projects->take(5)),
        );
    }

    public function touchProgress(OwnerAccount $account): void
    {
        $onboarding = $account->onboarding;

        if ($onboarding->status === 'account_created') {
            $this->applyOnboardingStatus($account, $onboarding, 'kyb_in_progress');
        }
    }

    public function submitForReview(User $user): OwnerWorkspaceData
    {
        $account = $this->provisioner->ensureForUser($user)
            ->loadMissing(['organization', 'bankProfile', 'onboarding', 'projects.documents']);

        $checklist = $this->buildChecklist($account);

        if (! $this->canSubmitForReview($checklist)) {
            throw ValidationException::withMessages([
                'onboarding' => ['Заполните профиль аккаунта, данные организации и банковские реквизиты перед отправкой на проверку.'],
            ]);
        }

        $onboarding = $account->onboarding;

        if (! in_array($onboarding->status, ['kyb_under_review', 'kyb_approved', 'active'], true)) {
            $onboarding->forceFill([
                'status' => 'kyb_under_review',
                'submitted_at' => now(),
                'rejection_reason' => null,
            ])->save();

            $account->forceFill(['status' => 'kyb_under_review'])->save();
        }

        return $this->getWorkspace($user);
    }

    /**
     * @return Collection<int, OwnerChecklistItemData>
     */
    public function buildChecklist(OwnerAccount $account): Collection
    {
        $organization = $account->organization;
        $bankProfile = $account->bankProfile;
        $projectsCount = $account->projects()->count();

        return collect([
            new OwnerChecklistItemData(
                key: 'account_profile',
                title: 'Профиль кабинета',
                description: 'Укажите название кабинета, сайт и короткое описание вашей компании.',
                completed: filled($account->display_name) && filled($account->website_url) && filled($account->overview),
                href: '/app/owner/organization',
            ),
            new OwnerChecklistItemData(
                key: 'organization',
                title: 'Данные организации',
                description: 'Юрлицо, регистрационные данные, подписант и бенефициар.',
                completed: filled($organization?->legal_name)
                    && filled($organization?->entity_type)
                    && filled($organization?->registration_number)
                    && filled($organization?->tax_id)
                    && filled($organization?->signatory_name),
                href: '/app/owner/organization',
            ),
            new OwnerChecklistItemData(
                key: 'bank_profile',
                title: 'Расчетные реквизиты',
                description: 'Заполните получателя, банк, БИК и счет для будущих расчетов по объектам.',
                completed: filled($bankProfile?->recipient_name)
                    && filled($bankProfile?->bank_name)
                    && filled($bankProfile?->bank_bik)
                    && filled($bankProfile?->bank_account)
                    && filled($bankProfile?->correspondent_account),
                href: '/app/owner/organization',
            ),
            new OwnerChecklistItemData(
                key: 'first_project',
                title: 'Первый черновик проекта',
                description: 'Подготовьте карточку проекта заранее, чтобы после проверки сразу перейти к публикации.',
                completed: $projectsCount > 0,
                href: '/app/owner/projects',
            ),
        ]);
    }

    /**
     * @param  Collection<int, OwnerChecklistItemData>  $checklist
     * @return Collection<int, OwnerActionItemData>
     */
    private function buildActionItems(Collection $checklist, int $projectsCount): Collection
    {
        $items = $checklist
            ->filter(fn (OwnerChecklistItemData $item) => ! $item->completed)
            ->map(fn (OwnerChecklistItemData $item) => new OwnerActionItemData(
                key: $item->key,
                title: $item->title,
                description: $item->description,
                href: $item->href,
                tone: $item->key === 'first_project' ? 'neutral' : 'warning',
            ));

        if ($projectsCount > 0) {
            $items->push(new OwnerActionItemData(
                key: 'review_window',
                title: 'Проверьте готовность проекта к проверке',
                description: 'Когда профиль и реквизиты заполнены, можно собрать документы и отправить проект на проверку.',
                href: '/app/owner/projects',
                tone: 'neutral',
            ));
        }

        return $items->values();
    }

    /**
     * @param  Collection<int, OwnerChecklistItemData>  $checklist
     */
    private function canSubmitForReview(Collection $checklist): bool
    {
        return $checklist
            ->whereIn('key', ['account_profile', 'organization', 'bank_profile'])
            ->every(fn (OwnerChecklistItemData $item) => $item->completed);
    }

    private function applyOnboardingStatus(OwnerAccount $account, OwnerOnboarding $onboarding, string $status): void
    {
        $onboarding->forceFill(['status' => $status])->save();
        $account->forceFill(['status' => $status])->save();
    }
}
