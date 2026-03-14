<?php

namespace App\Modules\Identity\Domain\Models;

use App\Models\User;
use App\Modules\Compliance\Domain\Models\KycDocument;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class KycProfile extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;

    protected $table = 'kyc_profiles';

    protected $fillable = [
        'id',
        'user_id',
        'status',
        'legal_name',
        'birth_date',
        'tax_id',
        'document_number',
        'address',
        'notes',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
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

    public function documents(): HasMany
    {
        return $this->hasMany(KycDocument::class)->latest();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['user_id', 'status', 'legal_name', 'tax_id', 'reviewed_by'])
            ->logOnlyDirty();
    }
}
