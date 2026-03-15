<?php

namespace App\Modules\Payments\Domain\Models;

use App\Models\User;
use App\Modules\Investing\Domain\Models\InvestorAllocation;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DistributionLine extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'distribution_lines';

    protected $fillable = [
        'id',
        'distribution_id',
        'investor_allocation_id',
        'user_id',
        'payout_instruction_id',
        'amount',
        'status',
        'failure_reason',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'paid_at' => 'datetime',
        ];
    }

    public function distribution(): BelongsTo
    {
        return $this->belongsTo(Distribution::class);
    }

    public function allocation(): BelongsTo
    {
        return $this->belongsTo(InvestorAllocation::class, 'investor_allocation_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payoutInstruction(): BelongsTo
    {
        return $this->belongsTo(PayoutInstruction::class);
    }
}
