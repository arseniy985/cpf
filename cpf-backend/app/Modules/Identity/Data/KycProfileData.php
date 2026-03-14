<?php

namespace App\Modules\Identity\Data;

use App\Modules\Identity\Domain\Models\KycProfile;
use Spatie\LaravelData\Data;

class KycProfileData extends Data
{
    public function __construct(
        public string $id,
        public string $status,
        public string $legalName,
        public ?string $birthDate,
        public ?string $taxId,
        public ?string $documentNumber,
        public ?string $address,
        public ?string $notes,
        public ?string $submittedAt,
        public ?string $reviewedAt,
    ) {}

    public static function fromModel(KycProfile $profile): self
    {
        return new self(
            id: $profile->id,
            status: $profile->status,
            legalName: $profile->legal_name,
            birthDate: $profile->birth_date?->toDateString(),
            taxId: $profile->tax_id,
            documentNumber: $profile->document_number,
            address: $profile->address,
            notes: $profile->notes,
            submittedAt: $profile->submitted_at?->toAtomString(),
            reviewedAt: $profile->reviewed_at?->toAtomString(),
        );
    }
}
