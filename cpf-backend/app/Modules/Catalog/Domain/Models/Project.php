<?php

namespace App\Modules\Catalog\Domain\Models;

use App\Models\User;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Origination\Domain\Models\OwnerAccount;
use App\Modules\Origination\Domain\Models\ProjectReport;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Project extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;
    use SoftDeletes;

    protected $table = 'projects';

    protected $fillable = [
        'id',
        'owner_id',
        'owner_account_id',
        'slug',
        'title',
        'excerpt',
        'description',
        'thesis',
        'risk_summary',
        'location',
        'asset_type',
        'status',
        'funding_status',
        'risk_level',
        'payout_frequency',
        'min_investment',
        'target_amount',
        'current_amount',
        'target_yield',
        'term_months',
        'cover_image_url',
        'hero_metric',
        'is_featured',
        'published_at',
        'review_submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
            'min_investment' => 'integer',
            'target_amount' => 'integer',
            'current_amount' => 'integer',
            'target_yield' => 'decimal:2',
            'term_months' => 'integer',
            'review_submitted_at' => 'datetime',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function ownerAccount(): BelongsTo
    {
        return $this->belongsTo(OwnerAccount::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ProjectDocument::class)->orderBy('sort_order');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(ProjectReport::class)->latest('report_date');
    }

    public function faqItems(): HasMany
    {
        return $this->hasMany(ProjectFaqItem::class)->orderBy('sort_order');
    }

    public function investmentApplications(): HasMany
    {
        return $this->hasMany(InvestmentApplication::class);
    }

    public function offeringRounds(): HasMany
    {
        return $this->hasMany(OfferingRound::class)->latest();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('status', 'published')
            ->whereNotNull('published_at');
    }

    public function scopeFeatured(Builder $query, bool $value = true): Builder
    {
        return $query->where('is_featured', $value);
    }

    public function getFundingProgressAttribute(): int
    {
        if ($this->target_amount <= 0) {
            return 0;
        }

        return (int) min(100, round(($this->current_amount / $this->target_amount) * 100));
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'title',
                'slug',
                'status',
                'funding_status',
                'current_amount',
                'target_amount',
                'target_yield',
                'owner_id',
                'owner_account_id',
            ])
            ->logOnlyDirty();
    }
}
