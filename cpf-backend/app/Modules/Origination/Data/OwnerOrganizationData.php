<?php

namespace App\Modules\Origination\Data;

use App\Modules\Origination\Domain\Models\OwnerOrganization;
use Spatie\LaravelData\Data;

class OwnerOrganizationData extends Data
{
    public function __construct(
        public string $id,
        public ?string $legalName,
        public ?string $brandName,
        public ?string $entityType,
        public ?string $registrationNumber,
        public ?string $taxId,
        public ?string $websiteUrl,
        public ?string $address,
        public ?string $signatoryName,
        public ?string $signatoryRole,
        public ?string $beneficiaryName,
        public ?string $overview,
    ) {}

    public static function fromModel(?OwnerOrganization $organization): self
    {
        return new self(
            id: $organization?->id ?? '',
            legalName: $organization?->legal_name,
            brandName: $organization?->brand_name,
            entityType: $organization?->entity_type,
            registrationNumber: $organization?->registration_number,
            taxId: $organization?->tax_id,
            websiteUrl: $organization?->website_url,
            address: $organization?->address,
            signatoryName: $organization?->signatory_name,
            signatoryRole: $organization?->signatory_role,
            beneficiaryName: $organization?->beneficiary_name,
            overview: $organization?->overview,
        );
    }
}
