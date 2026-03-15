<?php

namespace App\Modules\Origination\Data;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;

class OwnerWorkspaceData extends Data
{
    /**
     * @param  Collection<int, OwnerActionItemData>  $actionItems
     * @param  Collection<int, \App\Modules\Catalog\Data\ProjectData>  $latestProjects
     * @param  array<string, int>  $summary
     */
    public function __construct(
        public OwnerAccountData $account,
        public OwnerOrganizationData $organization,
        public OwnerBankProfileData $bankProfile,
        public OwnerOnboardingData $onboarding,
        public Collection $actionItems,
        public array $summary,
        public Collection $latestProjects,
    ) {}
}
