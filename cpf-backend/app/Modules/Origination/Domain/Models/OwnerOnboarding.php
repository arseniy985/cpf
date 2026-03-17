<?php

namespace App\Modules\Origination\Domain\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class OwnerOnboarding extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;

    protected $table = 'owner_onboardings';

    protected $fillable = [
        'id',
        'owner_account_id',
        'status',
        'invited_at',
        'account_created_at',
        'submitted_at',
        'reviewed_at',
        'activated_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'invited_at' => 'datetime',
            'account_created_at' => 'datetime',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'activated_at' => 'datetime',
        ];
    }

    public function ownerAccount(): BelongsTo
    {
        return $this->belongsTo(OwnerAccount::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'status',
                'invited_at',
                'account_created_at',
                'submitted_at',
                'reviewed_at',
                'activated_at',
                'rejection_reason',
            ])
            ->logOnlyDirty();
    }
}
