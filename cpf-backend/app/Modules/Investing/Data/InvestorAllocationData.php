<?php

namespace App\Modules\Investing\Data;

use App\Modules\Catalog\Data\ProjectData;
use App\Modules\Investing\Domain\Models\InvestorAllocation;
use App\Modules\Origination\Data\OfferingRoundData;
use Spatie\LaravelData\Data;

class InvestorAllocationData extends Data
{
    public function __construct(
        public string $id,
        public int $userId,
        public ?string $investorName,
        public ?string $investorEmail,
        public int $amount,
        public string $status,
        public ?string $agreementUrl,
        public ?string $allocatedAt,
        public ?string $settledAt,
        public ProjectData $project,
        public OfferingRoundData $round,
    ) {}

    public static function fromModel(InvestorAllocation $allocation): self
    {
        return new self(
            id: $allocation->id,
            userId: $allocation->user_id,
            investorName: $allocation->relationLoaded('user') ? $allocation->user?->name : null,
            investorEmail: $allocation->relationLoaded('user') ? $allocation->user?->email : null,
            amount: $allocation->amount,
            status: $allocation->status,
            agreementUrl: $allocation->agreement_url,
            allocatedAt: $allocation->allocated_at?->toAtomString(),
            settledAt: $allocation->settled_at?->toAtomString(),
            project: ProjectData::fromModel($allocation->project),
            round: OfferingRoundData::fromModel($allocation->round),
        );
    }
}
