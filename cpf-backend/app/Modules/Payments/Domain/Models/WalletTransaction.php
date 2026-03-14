<?php

namespace App\Modules\Payments\Domain\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTransaction extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'wallet_transactions';

    protected $fillable = [
        'id',
        'user_id',
        'type',
        'direction',
        'status',
        'amount',
        'currency',
        'reference_type',
        'reference_id',
        'description',
        'meta',
        'occurred_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'meta' => 'array',
            'occurred_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
