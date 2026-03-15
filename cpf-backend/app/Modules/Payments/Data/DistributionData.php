<?php

namespace App\Modules\Payments\Data;

use App\Modules\Origination\Data\OfferingRoundData;
use App\Modules\Payments\Domain\Models\Distribution;
use App\Modules\Payments\Domain\Models\DistributionLine;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;

class DistributionData extends Data
{
    /**
     * @param  Collection<int, DistributionLineData>  $lines
     */
    public function __construct(
        public string $id,
        public string $title,
        public string $periodLabel,
        public ?string $periodStart,
        public ?string $periodEnd,
        public int $totalAmount,
        public int $linesCount,
        public string $status,
        public string $payoutMode,
        public ?string $approvedAt,
        public ?string $processedAt,
        public ?string $paidAt,
        public ?string $notes,
        public OfferingRoundData $round,
        public Collection $lines,
    ) {}

    public static function fromModel(Distribution $distribution): self
    {
        return new self(
            id: $distribution->id,
            title: $distribution->title,
            periodLabel: $distribution->period_label,
            periodStart: $distribution->period_start?->toDateString(),
            periodEnd: $distribution->period_end?->toDateString(),
            totalAmount: $distribution->total_amount,
            linesCount: $distribution->lines_count,
            status: $distribution->status,
            payoutMode: $distribution->payout_mode,
            approvedAt: $distribution->approved_at?->toAtomString(),
            processedAt: $distribution->processed_at?->toAtomString(),
            paidAt: $distribution->paid_at?->toAtomString(),
            notes: $distribution->notes,
            round: OfferingRoundData::fromModel($distribution->round),
            lines: $distribution->relationLoaded('lines')
                ? $distribution->lines->map(static fn (DistributionLine $line) => DistributionLineData::fromModel($line))
                : collect(),
        );
    }
}
