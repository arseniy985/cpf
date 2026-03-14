<?php

namespace App\Modules\Investing\Domain\Models;

use App\Models\User;
use App\Modules\Catalog\Domain\Models\Project;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InvestmentApplication extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;

    protected $table = 'investment_applications';

    protected $fillable = [
        'id',
        'user_id',
        'project_id',
        'amount',
        'status',
        'confirmed_at',
        'agreement_url',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'confirmed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['user_id', 'project_id', 'amount', 'status'])
            ->logOnlyDirty();
    }
}
