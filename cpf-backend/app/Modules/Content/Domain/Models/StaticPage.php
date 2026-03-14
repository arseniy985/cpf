<?php

namespace App\Modules\Content\Domain\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaticPage extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = 'static_pages';

    protected $fillable = [
        'id',
        'key',
        'title',
        'headline',
        'summary',
        'body',
        'meta',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'meta' => 'array',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
