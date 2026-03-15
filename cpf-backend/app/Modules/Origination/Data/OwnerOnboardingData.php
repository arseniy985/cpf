<?php

namespace App\Modules\Origination\Data;

use App\Modules\Origination\Domain\Models\OwnerOnboarding;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;

class OwnerOnboardingData extends Data
{
    /**
     * @param  Collection<int, OwnerChecklistItemData>  $checklist
     */
    public function __construct(
        public string $status,
        public int $progressPercent,
        public Collection $checklist,
        public bool $canSubmitForReview,
        public ?string $submittedAt,
        public ?string $reviewedAt,
        public ?string $activatedAt,
        public ?string $rejectionReason,
    ) {}

    /**
     * @param  Collection<int, OwnerChecklistItemData>  $checklist
     */
    public static function fromModel(
        ?OwnerOnboarding $onboarding,
        Collection $checklist,
        bool $canSubmitForReview,
    ): self {
        $total = max(1, $checklist->count());
        $completed = $checklist->where('completed', true)->count();

        return new self(
            status: $onboarding?->status ?? 'account_created',
            progressPercent: (int) round(($completed / $total) * 100),
            checklist: $checklist,
            canSubmitForReview: $canSubmitForReview,
            submittedAt: $onboarding?->submitted_at?->toAtomString(),
            reviewedAt: $onboarding?->reviewed_at?->toAtomString(),
            activatedAt: $onboarding?->activated_at?->toAtomString(),
            rejectionReason: $onboarding?->rejection_reason,
        );
    }
}
