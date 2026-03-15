<?php

namespace App\Modules\Origination\Domain\Models;

use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Investing\Domain\Models\InvestorAllocation;
use App\Modules\Payments\Domain\Models\Distribution;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OfferingRound extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'offering_rounds';

    protected $fillable = [
        'id',
        'project_id',
        'owner_account_id',
        'slug',
        'title',
        'status',
        'target_amount',
        'current_amount',
        'min_investment',
        'target_yield',
        'payout_frequency',
        'term_months',
        'oversubscription_allowed',
        'opens_at',
        'closes_at',
        'review_submitted_at',
        'went_live_at',
        'closed_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'target_amount' => 'integer',
            'current_amount' => 'integer',
            'min_investment' => 'integer',
            'target_yield' => 'decimal:2',
            'term_months' => 'integer',
            'oversubscription_allowed' => 'boolean',
            'opens_at' => 'datetime',
            'closes_at' => 'datetime',
            'review_submitted_at' => 'datetime',
            'went_live_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function ownerAccount(): BelongsTo
    {
        return $this->belongsTo(OwnerAccount::class);
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(InvestorAllocation::class);
    }

    public function distributions(): HasMany
    {
        return $this->hasMany(Distribution::class)->latest();
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
