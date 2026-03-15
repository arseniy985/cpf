<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Engagement\Domain\Models\Notification;
use App\Modules\Identity\Domain\Models\KycProfile;
use App\Modules\Investing\Domain\Models\InvestorAllocation;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use App\Modules\Origination\Domain\Models\OwnerAccount;
use App\Modules\Origination\Domain\Models\OwnerMember;
use App\Modules\Payments\Domain\Models\DistributionLine;
use App\Modules\Payments\Domain\Models\InvestorPayoutProfile;
use App\Modules\Payments\Domain\Models\ManualDepositRequest;
use App\Modules\Payments\Domain\Models\PayoutInstruction;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use App\Modules\Payments\Domain\Models\WalletTransaction;
use App\Modules\Payments\Domain\Models\WithdrawalRequest;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, LogsActivity, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'is_active',
        'last_login_at',
        'notification_preferences',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
            'notification_preferences' => 'array',
            'password' => 'hashed',
        ];
    }

    public function kycProfile(): HasOne
    {
        return $this->hasOne(KycProfile::class);
    }

    public function investmentApplications(): HasMany
    {
        return $this->hasMany(InvestmentApplication::class);
    }

    public function investorAllocations(): HasMany
    {
        return $this->hasMany(InvestorAllocation::class);
    }

    public function paymentTransactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function withdrawalRequests(): HasMany
    {
        return $this->hasMany(WithdrawalRequest::class);
    }

    public function manualDepositRequests(): HasMany
    {
        return $this->hasMany(ManualDepositRequest::class);
    }

    public function walletTransactions(): HasMany
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function distributionLines(): HasMany
    {
        return $this->hasMany(DistributionLine::class);
    }

    public function payoutInstructions(): HasMany
    {
        return $this->hasMany(PayoutInstruction::class);
    }

    public function investorPayoutProfile(): HasOne
    {
        return $this->hasOne(InvestorPayoutProfile::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class)->latest();
    }

    public function ownedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    public function ownerMemberships(): HasMany
    {
        return $this->hasMany(OwnerMember::class);
    }

    public function primaryOwnerAccounts(): HasMany
    {
        return $this->hasMany(OwnerAccount::class, 'primary_user_id');
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->hasAnyRole([
            'admin',
            'manager',
            'compliance',
            'content_manager',
            'accountant',
        ]);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'phone', 'is_active', 'last_login_at'])
            ->logOnlyDirty();
    }
}
