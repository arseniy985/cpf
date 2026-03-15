<?php

namespace App\Modules\Payments\Domain\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ManualDepositRequest extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;

    protected $table = 'manual_deposit_requests';

    protected $fillable = [
        'id',
        'user_id',
        'amount',
        'currency',
        'status',
        'reference_code',
        'idempotency_key',
        'recipient_name',
        'bank_name',
        'bank_account',
        'bank_bik',
        'correspondent_account',
        'payment_purpose',
        'manager_name',
        'manager_email',
        'manager_phone',
        'manager_telegram',
        'payer_name',
        'payer_bank',
        'payer_account_last4',
        'comment',
        'receipt_disk',
        'receipt_path',
        'receipt_original_name',
        'receipt_mime_type',
        'receipt_size',
        'review_note',
        'submitted_at',
        'receipt_uploaded_at',
        'reviewed_at',
        'approved_at',
        'credited_at',
        'cancelled_at',
        'expires_at',
        'reviewed_by',
        'wallet_transaction_id',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'receipt_size' => 'integer',
            'submitted_at' => 'datetime',
            'receipt_uploaded_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'approved_at' => 'datetime',
            'credited_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'expires_at' => 'datetime',
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
            ->logOnly(['user_id', 'amount', 'status', 'reference_code', 'reviewed_by', 'wallet_transaction_id'])
            ->logOnlyDirty();
    }
}
