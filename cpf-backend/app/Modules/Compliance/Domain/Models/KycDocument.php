<?php

namespace App\Modules\Compliance\Domain\Models;

use App\Models\User;
use App\Modules\Identity\Domain\Models\KycProfile;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KycDocument extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'kyc_documents';

    protected $fillable = [
        'id',
        'kyc_profile_id',
        'kind',
        'status',
        'original_name',
        'disk',
        'path',
        'mime_type',
        'size',
        'review_comment',
        'reviewed_at',
        'reviewed_by',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'reviewed_at' => 'datetime',
        ];
    }

    public function kycProfile(): BelongsTo
    {
        return $this->belongsTo(KycProfile::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
