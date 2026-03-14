<?php

namespace App\Modules\Catalog\Data;

use App\Modules\Catalog\Domain\Models\ProjectFaqItem;
use Spatie\LaravelData\Data;

class ProjectFaqItemData extends Data
{
    public function __construct(
        public string $id,
        public string $question,
        public string $answer,
    ) {}

    public static function fromModel(ProjectFaqItem $item): self
    {
        return new self(
            id: $item->id,
            question: $item->question,
            answer: $item->answer,
        );
    }
}
