<?php

namespace App\Modules\Origination\Data;

use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;

class OwnerTeamData extends Data
{
    /**
     * @param  Collection<int, OwnerTeamMemberData>  $members
     * @param  Collection<int, \App\Modules\Content\Data\LegalDocumentData>  $legalDocuments
     * @param  Collection<int, OwnerActivityEntryData>  $activity
     */
    public function __construct(
        public string $accountId,
        public string $accountSlug,
        public string $accountName,
        public Collection $members,
        public Collection $legalDocuments,
        public Collection $activity,
    ) {}
}
