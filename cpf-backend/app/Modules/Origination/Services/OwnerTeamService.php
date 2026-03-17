<?php

namespace App\Modules\Origination\Services;

use App\Models\User;
use App\Modules\Content\Data\LegalDocumentData;
use App\Modules\Content\Domain\Models\LegalDocument;
use App\Modules\Origination\Data\OwnerActivityEntryData;
use App\Modules\Origination\Data\OwnerTeamData;
use App\Modules\Origination\Data\OwnerTeamMemberData;

class OwnerTeamService
{
    public function __construct(
        private readonly OwnerAccountProvisioner $provisioner,
        private readonly OwnerActivityService $activityService,
    ) {}

    public function getTeam(User $user): OwnerTeamData
    {
        $account = $this->provisioner
            ->ensureForUser($user)
            ->loadMissing(['members.user', 'onboarding']);

        $activity = $this->activityService
            ->forSubjects([
                $account,
                $account->onboarding,
                ...$account->members->all(),
            ])
            ->map(fn ($entry) => OwnerActivityEntryData::fromModel($entry));

        $legalDocuments = LegalDocument::query()
            ->published()
            ->latest('published_at')
            ->limit(6)
            ->get()
            ->map(fn ($document) => LegalDocumentData::fromModel($document));

        return new OwnerTeamData(
            accountId: $account->id,
            accountSlug: $account->slug,
            accountName: $account->display_name,
            members: $account->members->map(fn ($member) => OwnerTeamMemberData::fromModel($member)),
            legalDocuments: $legalDocuments,
            activity: $activity,
        );
    }
}
