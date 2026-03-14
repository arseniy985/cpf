<?php

namespace App\Modules\Origination\Domain\Models;

use App\Modules\Catalog\Domain\Models\Project;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectReport extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'project_reports';

    protected $fillable = [
        'id',
        'project_id',
        'title',
        'summary',
        'file_url',
        'report_date',
        'is_public',
    ];

    protected function casts(): array
    {
        return [
            'report_date' => 'date',
            'is_public' => 'boolean',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
