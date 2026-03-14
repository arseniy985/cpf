<?php

namespace App\Modules\Payments\Domain\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class WithdrawalRequest extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;

    protected $table = 'withdrawal_requests';

    protected $fillable = [
        'id',
        'user_id',
        'amount',
        'status',
        'bank_name',
        'bank_account',
        'comment',
        'idempotency_key',
        'review_note',
        'reviewed_at',
        'paid_at',
        'cancelled_at',
        'reviewed_by',
        'wallet_transaction_id',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'reviewed_at' => 'datetime',
            'paid_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function walletTransaction(): BelongsTo
    {
        return $this->belongsTo(WalletTransaction::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['user_id', 'amount', 'status', 'bank_name', 'reviewed_by'])
            ->logOnlyDirty();
    }
}
