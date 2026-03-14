<?php

namespace App\Modules\Catalog\Data;

use App\Modules\Catalog\Domain\Models\ProjectDocument;
use Spatie\LaravelData\Data;

class ProjectDocumentData extends Data
{
    public function __construct(
        public string $id,
        public string $title,
        public string $kind,
        public ?string $label,
        public ?string $fileUrl,
        public bool $isPublic,
    ) {}

    public static function fromModel(ProjectDocument $document): self
    {
        return new self(
            id: $document->id,
            title: $document->title,
            kind: $document->kind,
            label: $document->label,
            fileUrl: $document->file_url,
            isPublic: $document->is_public,
        );
    }
}
