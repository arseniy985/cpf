<?php

namespace App\Modules\Content\Data;

use App\Modules\Content\Domain\Models\CaseStudy;
use Spatie\LaravelData\Data;

class CaseStudyData extends Data
{
    public function __construct(
        public string $id,
        public string $slug,
        public string $title,
        public string $excerpt,
        public string $body,
        public ?string $resultMetric,
        public ?string $publishedAt,
    ) {}

    public static function fromModel(CaseStudy $study): self
    {
        return new self(
            id: $study->id,
            slug: $study->slug,
            title: $study->title,
            excerpt: $study->excerpt,
            body: $study->body,
            resultMetric: $study->result_metric,
            publishedAt: $study->published_at?->toAtomString(),
        );
    }
}
