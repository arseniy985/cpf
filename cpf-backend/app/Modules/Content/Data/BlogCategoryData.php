<?php

namespace App\Modules\Content\Data;

use App\Modules\Content\Domain\Models\BlogCategory;
use Spatie\LaravelData\Data;

class BlogCategoryData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public string $slug,
    ) {}

    public static function fromModel(BlogCategory $category): self
    {
        return new self(
            id: $category->id,
            name: $category->name,
            slug: $category->slug,
        );
    }
}
