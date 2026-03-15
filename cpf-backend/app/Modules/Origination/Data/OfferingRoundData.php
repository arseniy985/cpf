<?php

namespace App\Modules\Origination\Data;

use App\Modules\Origination\Domain\Models\OfferingRound;
use Spatie\LaravelData\Data;

class OfferingRoundData extends Data
{
    public function __construct(
        public string $id,
        public string $projectId,
        public ?string $projectTitle,
        public ?string $projectSlug,
        public string $slug,
        public string $title,
        public string $status,
        public int $targetAmount,
        public int $currentAmount,
        public int $minInvestment,
        public float $targetYield,
        public string $payoutFrequency,
        public int $termMonths,
        public bool $oversubscriptionAllowed,
        public ?string $opensAt,
        public ?string $closesAt,
        public ?string $reviewSubmittedAt,
        public ?string $wentLiveAt,
        public ?string $closedAt,
        public ?string $notes,
        public int $allocationCount,
        public int $distributionCount,
    ) {}

    public static function fromModel(OfferingRound $round): self
    {
        return new self(
            id: $round->id,
            projectId: $round->project_id,
            projectTitle: $round->relationLoaded('project') ? $round->project?->title : null,
            projectSlug: $round->relationLoaded('project') ? $round->project?->slug : null,
            slug: $round->slug,
            title: $round->title,
            status: $round->status,
            targetAmount: $round->target_amount,
            currentAmount: $round->current_amount,
            minInvestment: $round->min_investment,
            targetYield: (float) $round->target_yield,
            payoutFrequency: $round->payout_frequency,
            termMonths: $round->term_months,
            oversubscriptionAllowed: $round->oversubscription_allowed,
            opensAt: $round->opens_at?->toAtomString(),
            closesAt: $round->closes_at?->toAtomString(),
            reviewSubmittedAt: $round->review_submitted_at?->toAtomString(),
            wentLiveAt: $round->went_live_at?->toAtomString(),
            closedAt: $round->closed_at?->toAtomString(),
            notes: $round->notes,
            allocationCount: $round->relationLoaded('allocations') ? $round->allocations->count() : 0,
            distributionCount: $round->relationLoaded('distributions') ? $round->distributions->count() : 0,
        );
    }
}
