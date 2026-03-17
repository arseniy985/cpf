<?php

namespace App\Modules\Origination\Domain\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class OwnerOrganization extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;

    protected $table = 'owner_organizations';

    protected $fillable = [
        'id',
        'owner_account_id',
        'legal_name',
        'brand_name',
        'entity_type',
        'registration_number',
        'tax_id',
        'website_url',
        'address',
        'signatory_name',
        'signatory_role',
        'beneficiary_name',
        'overview',
    ];

    public function ownerAccount(): BelongsTo
    {
        return $this->belongsTo(OwnerAccount::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'legal_name',
                'brand_name',
                'entity_type',
                'registration_number',
                'tax_id',
                'website_url',
                'address',
                'signatory_name',
                'signatory_role',
                'beneficiary_name',
                'overview',
            ])
            ->logOnlyDirty();
    }
}
