<?php

namespace App\Modules\Origination\Domain\Models;

use App\Models\User;
use App\Modules\Catalog\Domain\Models\Project;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OwnerAccount extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'owner_accounts';

    protected $fillable = [
        'id',
        'primary_user_id',
        'slug',
        'display_name',
        'status',
        'overview',
        'website_url',
    ];

    public function primaryUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'primary_user_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(OwnerMember::class);
    }

    public function organization(): HasOne
    {
        return $this->hasOne(OwnerOrganization::class);
    }

    public function bankProfile(): HasOne
    {
        return $this->hasOne(OwnerBankProfile::class);
    }

    public function onboarding(): HasOne
    {
        return $this->hasOne(OwnerOnboarding::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
