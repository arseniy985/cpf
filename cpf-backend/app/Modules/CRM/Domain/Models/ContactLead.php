<?php

namespace App\Modules\CRM\Domain\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ContactLead extends Model
{
    use HasFactory;
    use HasUlids;
    use LogsActivity;

    protected $table = 'contact_leads';

    protected $fillable = [
        'id',
        'full_name',
        'email',
        'phone',
        'subject',
        'source',
        'message',
        'status',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['full_name', 'email', 'phone', 'subject', 'source', 'status'])
            ->logOnlyDirty();
    }
}
