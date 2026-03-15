<?php

namespace App\Modules\Origination\Domain\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OwnerBankProfile extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'owner_bank_profiles';

    protected $fillable = [
        'id',
        'owner_account_id',
        'payout_method',
        'recipient_name',
        'bank_name',
        'bank_bik',
        'bank_account',
        'correspondent_account',
        'status',
        'notes',
    ];

    public function ownerAccount(): BelongsTo
    {
        return $this->belongsTo(OwnerAccount::class);
    }
}
