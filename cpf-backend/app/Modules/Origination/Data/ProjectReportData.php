<?php

namespace App\Modules\Origination\Data;

use App\Modules\Origination\Domain\Models\ProjectReport;
use Spatie\LaravelData\Data;

class ProjectReportData extends Data
{
    public function __construct(
        public string $id,
        public string $title,
        public ?string $summary,
        public ?string $fileUrl,
        public string $reportDate,
        public bool $isPublic,
    ) {}

    public static function fromModel(ProjectReport $report): self
    {
        return new self(
            id: $report->id,
            title: $report->title,
            summary: $report->summary,
            fileUrl: $report->file_url,
            reportDate: $report->report_date->toDateString(),
            isPublic: $report->is_public,
        );
    }
}
