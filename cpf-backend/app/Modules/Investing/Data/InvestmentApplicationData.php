<?php

namespace App\Modules\Investing\Data;

use App\Modules\Catalog\Data\ProjectData;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use App\Modules\Origination\Data\OfferingRoundData;
use Spatie\LaravelData\Data;

class InvestmentApplicationData extends Data
{
    public function __construct(
        public string $id,
        public int $amount,
        public string $status,
        public ?string $notes,
        public ProjectData $project,
        public ?OfferingRoundData $round,
        public string $createdAt,
    ) {}

    public static function fromModel(InvestmentApplication $application): self
    {
        return new self(
            id: $application->id,
            amount: $application->amount,
            status: $application->status,
            notes: $application->notes,
            project: ProjectData::fromModel($application->project),
            round: $application->round ? OfferingRoundData::fromModel($application->round) : null,
            createdAt: $application->created_at->toAtomString(),
        );
    }
}
