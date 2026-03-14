<?php

namespace App\Modules\Content\Data;

use App\Modules\Content\Domain\Models\StaticPage;
use Spatie\LaravelData\Data;

class StaticPageData extends Data
{
    public function __construct(
        public string $id,
        public string $key,
        public string $title,
        public ?string $headline,
        public ?string $summary,
        public ?string $body,
        public array $meta,
    ) {}

    public static function fromModel(StaticPage $page): self
    {
        return new self(
            id: $page->id,
            key: $page->key,
            title: $page->title,
            headline: $page->headline,
            summary: $page->summary,
            body: $page->body,
            meta: $page->meta ?? [],
        );
    }
}
