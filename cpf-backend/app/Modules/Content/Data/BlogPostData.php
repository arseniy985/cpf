<?php

namespace App\Modules\Content\Data;

use App\Modules\Content\Domain\Models\BlogPost;
use Spatie\LaravelData\Data;

class BlogPostData extends Data
{
    public function __construct(
        public string $id,
        public string $slug,
        public string $title,
        public string $excerpt,
        public string $body,
        public array $tags,
        public ?BlogCategoryData $category,
        public ?string $publishedAt,
    ) {}

    public static function fromModel(BlogPost $post): self
    {
        return new self(
            id: $post->id,
            slug: $post->slug,
            title: $post->title,
            excerpt: $post->excerpt,
            body: $post->body,
            tags: $post->tags ?? [],
            category: $post->relationLoaded('category') && $post->category !== null
                ? BlogCategoryData::fromModel($post->category)
                : null,
            publishedAt: $post->published_at?->toAtomString(),
        );
    }
}
