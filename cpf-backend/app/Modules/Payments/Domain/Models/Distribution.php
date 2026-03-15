<?php

namespace App\Modules\Payments\Domain\Models;

use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Origination\Domain\Models\OwnerAccount;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Distribution extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'distributions';

    protected $fillable = [
        'id',
        'offering_round_id',
        'project_id',
        'owner_account_id',
        'title',
        'period_label',
        'period_start',
        'period_end',
        'total_amount',
        'lines_count',
        'status',
        'payout_mode',
        'approved_at',
        'processed_at',
        'paid_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'total_amount' => 'integer',
            'lines_count' => 'integer',
            'approved_at' => 'datetime',
            'processed_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    public function round(): BelongsTo
    {
        return $this->belongsTo(OfferingRound::class, 'offering_round_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function ownerAccount(): BelongsTo
    {
        return $this->belongsTo(OwnerAccount::class);
    }

    public function lines(): HasMany
    {
        return $this->hasMany(DistributionLine::class);
    }

    public function payoutInstructions(): HasMany
    {
        return $this->hasMany(PayoutInstruction::class);
    }
}
