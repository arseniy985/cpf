<?php

namespace App\Modules\Origination\Domain\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ProjectSubmission extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;

    protected $table = 'project_submissions';

    protected $fillable = [
        'id',
        'full_name',
        'email',
        'phone',
        'company_name',
        'project_name',
        'asset_type',
        'target_amount',
        'message',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'target_amount' => 'integer',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['full_name', 'email', 'company_name', 'project_name', 'asset_type', 'target_amount', 'status'])
            ->logOnlyDirty();
    }
}
