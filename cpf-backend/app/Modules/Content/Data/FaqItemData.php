<?php

namespace App\Modules\Content\Data;

use App\Modules\Content\Domain\Models\FaqItem;
use Spatie\LaravelData\Data;

class FaqItemData extends Data
{
    public function __construct(
        public string $id,
        public string $groupName,
        public string $question,
        public string $answer,
    ) {}

    public static function fromModel(FaqItem $faqItem): self
    {
        return new self(
            id: $faqItem->id,
            groupName: $faqItem->group_name,
            question: $faqItem->question,
            answer: $faqItem->answer,
        );
    }
}
