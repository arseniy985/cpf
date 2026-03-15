<?php

namespace App\Modules\Payments\Domain\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvestorPayoutProfile extends Model
{
    use HasFactory;
    use HasUlids;

    protected $fillable = [
        'id',
        'user_id',
        'provider',
        'status',
        'payout_method_label',
        'payout_token',
        'last_verified_at',
    ];

    protected function casts(): array
    {
        return [
            'payout_token' => 'encrypted',
            'last_verified_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isReady(): bool
    {
        return $this->status === 'ready' && filled($this->payout_token);
    }
}
