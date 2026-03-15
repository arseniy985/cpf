<?php

namespace App\Modules\Payments\Domain\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayoutInstruction extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'payout_instructions';

    protected $fillable = [
        'id',
        'distribution_id',
        'user_id',
        'amount',
        'currency',
        'direction',
        'gateway',
        'status',
        'external_id',
        'reference_label',
        'payload',
        'failure_reason',
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

    public function distribution(): BelongsTo
    {
        return $this->belongsTo(Distribution::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function distributionLine(): HasOne
    {
        return $this->hasOne(DistributionLine::class);
    }
}
