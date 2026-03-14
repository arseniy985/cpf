<?php

namespace App\Modules\Content\Data;

use App\Modules\Content\Domain\Models\Review;
use Spatie\LaravelData\Data;

class ReviewData extends Data
{
    public function __construct(
        public string $id,
        public string $authorName,
        public ?string $authorRole,
        public ?string $companyName,
        public int $rating,
        public string $body,
    ) {}

    public static function fromModel(Review $review): self
    {
        return new self(
            id: $review->id,
            authorName: $review->author_name,
            authorRole: $review->author_role,
            companyName: $review->company_name,
            rating: $review->rating,
            body: $review->body,
        );
    }
}
