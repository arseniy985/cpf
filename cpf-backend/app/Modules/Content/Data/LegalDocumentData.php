<?php

namespace App\Modules\Content\Data;

use App\Modules\Content\Domain\Models\LegalDocument;
use Spatie\LaravelData\Data;

class LegalDocumentData extends Data
{
    public function __construct(
        public string $id,
        public string $slug,
        public string $title,
        public ?string $summary,
        public string $documentType,
        public ?string $fileUrl,
        public ?string $publishedAt,
    ) {}

    public static function fromModel(LegalDocument $document): self
    {
        return new self(
            id: $document->id,
            slug: $document->slug,
            title: $document->title,
            summary: $document->summary,
            documentType: $document->document_type,
            fileUrl: $document->file_url,
            publishedAt: $document->published_at?->toAtomString(),
        );
    }
}
