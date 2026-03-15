<?php

namespace App\Modules\Payments\Data;

use App\Modules\Payments\Domain\Models\PayoutInstruction;
use Spatie\LaravelData\Data;

class PayoutInstructionData extends Data
{
    public function __construct(
        public string $id,
        public ?string $distributionId,
        public ?string $distributionTitle,
        public int $amount,
        public string $currency,
        public string $direction,
        public string $gateway,
        public string $status,
        public ?string $externalId,
        public ?string $referenceLabel,
        public ?string $failureReason,
        public ?string $processedAt,
    ) {}

    public static function fromModel(PayoutInstruction $instruction): self
    {
        return new self(
            id: $instruction->id,
            distributionId: $instruction->distribution_id,
            distributionTitle: $instruction->relationLoaded('distribution') ? $instruction->distribution?->title : null,
            amount: $instruction->amount,
            currency: $instruction->currency,
            direction: $instruction->direction,
            gateway: $instruction->gateway,
            status: $instruction->status,
            externalId: $instruction->external_id,
            referenceLabel: $instruction->reference_label,
            failureReason: $instruction->failure_reason,
            processedAt: $instruction->processed_at?->toAtomString(),
        );
    }
}
