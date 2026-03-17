<?php

namespace App\Modules\Origination\Domain\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class OwnerMember extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;

    protected $table = 'owner_members';

    protected $fillable = [
        'id',
        'owner_account_id',
        'user_id',
        'role',
        'status',
    ];

    public function ownerAccount(): BelongsTo
    {
        return $this->belongsTo(OwnerAccount::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['owner_account_id', 'user_id', 'role', 'status'])
            ->logOnlyDirty();
    }
}
