<?php

namespace App\Modules\Payments\Data;

use App\Modules\Investing\Data\InvestorAllocationData;
use App\Modules\Payments\Domain\Models\DistributionLine;
use Spatie\LaravelData\Data;

class DistributionLineData extends Data
{
    public function __construct(
        public string $id,
        public int $amount,
        public string $status,
        public ?string $failureReason,
        public ?string $paidAt,
        public InvestorAllocationData $allocation,
        public ?PayoutInstructionData $payoutInstruction,
    ) {}

    public static function fromModel(DistributionLine $line): self
    {
        return new self(
            id: $line->id,
            amount: $line->amount,
            status: $line->status,
            failureReason: $line->failure_reason,
            paidAt: $line->paid_at?->toAtomString(),
            allocation: InvestorAllocationData::fromModel($line->allocation),
            payoutInstruction: $line->payoutInstruction ? PayoutInstructionData::fromModel($line->payoutInstruction) : null,
        );
    }
}
