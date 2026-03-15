<?php

namespace App\Modules\Investing\Domain\Models;

use App\Models\User;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Payments\Domain\Models\DistributionLine;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvestorAllocation extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'investor_allocations';

    protected $fillable = [
        'id',
        'offering_round_id',
        'project_id',
        'user_id',
        'investment_application_id',
        'amount',
        'status',
        'agreement_url',
        'allocated_at',
        'settled_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'allocated_at' => 'datetime',
            'settled_at' => 'datetime',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(InvestmentApplication::class, 'investment_application_id');
    }

    public function distributionLines(): HasMany
    {
        return $this->hasMany(DistributionLine::class);
    }
}
