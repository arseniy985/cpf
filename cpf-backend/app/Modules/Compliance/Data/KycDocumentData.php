<?php

namespace App\Modules\Compliance\Data;

use App\Modules\Compliance\Domain\Models\KycDocument;
use Spatie\LaravelData\Data;

class KycDocumentData extends Data
{
    public function __construct(
        public string $id,
        public string $kind,
        public string $status,
        public string $originalName,
        public string $downloadUrl,
        public ?string $reviewComment,
        public string $createdAt,
    ) {}

    public static function fromModel(KycDocument $document): self
    {
        return new self(
            id: $document->id,
            kind: $document->kind,
            status: $document->status,
            originalName: $document->original_name,
            downloadUrl: route('kyc-documents.download', $document),
            reviewComment: $document->review_comment,
            createdAt: $document->created_at->toAtomString(),
        );
    }
}
