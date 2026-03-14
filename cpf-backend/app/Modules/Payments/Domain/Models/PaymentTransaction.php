<?php

namespace App\Modules\Payments\Domain\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class PaymentTransaction extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;

    protected $table = 'payment_transactions';

    protected $fillable = [
        'id',
        'user_id',
        'gateway',
        'type',
        'status',
        'status_reason',
        'amount',
        'currency',
        'external_id',
        'idempotency_key',
        'confirmation_url',
        'payload',
        'processed_at',
        'synced_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'payload' => 'array',
            'processed_at' => 'datetime',
            'synced_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['user_id', 'gateway', 'type', 'status', 'amount', 'currency', 'external_id'])
            ->logOnlyDirty();
    }
}
