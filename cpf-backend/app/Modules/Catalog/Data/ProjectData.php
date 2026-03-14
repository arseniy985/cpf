<?php

namespace App\Modules\Catalog\Data;

use App\Modules\Catalog\Domain\Models\Project;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Data;

class ProjectData extends Data
{
    #[Computed]
    public int $fundingProgress;

    public function __construct(
        public string $id,
        public string $slug,
        public string $title,
        public string $excerpt,
        public string $description,
        public ?string $thesis,
        public ?string $riskSummary,
        public string $location,
        public string $assetType,
        public string $status,
        public string $fundingStatus,
        public string $riskLevel,
        public string $payoutFrequency,
        public int $minInvestment,
        public int $targetAmount,
        public int $currentAmount,
        public float $targetYield,
        public int $termMonths,
        public ?string $coverImageUrl,
        public ?string $heroMetric,
        public bool $isFeatured,
        public ?string $publishedAt,
        /** @var Collection<int, ProjectDocumentData> */
        public Collection $documents,
    ) {}

    public static function fromModel(Project $project): self
    {
        $data = new self(
            id: $project->id,
            slug: $project->slug,
            title: $project->title,
            excerpt: $project->excerpt,
            description: $project->description,
            thesis: $project->thesis,
            riskSummary: $project->risk_summary,
            location: $project->location,
            assetType: $project->asset_type,
            status: $project->status,
            fundingStatus: $project->funding_status,
            riskLevel: $project->risk_level,
            payoutFrequency: $project->payout_frequency,
            minInvestment: $project->min_investment,
            targetAmount: $project->target_amount,
            currentAmount: $project->current_amount,
            targetYield: (float) $project->target_yield,
            termMonths: $project->term_months,
            coverImageUrl: $project->cover_image_url,
            heroMetric: $project->hero_metric,
            isFeatured: $project->is_featured,
            publishedAt: $project->published_at?->toAtomString(),
            documents: $project->relationLoaded('documents')
                ? $project->documents->map(static fn ($document) => ProjectDocumentData::fromModel($document))
                : collect(),
        );

        $data->fundingProgress = $project->funding_progress;

        return $data;
    }
}
