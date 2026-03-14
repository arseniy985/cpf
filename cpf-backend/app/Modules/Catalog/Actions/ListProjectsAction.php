<?php

namespace App\Modules\Catalog\Actions;

use App\Modules\Catalog\Domain\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ListProjectsAction
{
    public function execute(): LengthAwarePaginator
    {
        $perPage = (int) request()->integer('per_page', 12);

        return QueryBuilder::for(Project::query()->published()->with('documents'))
            ->allowedFilters([
                AllowedFilter::exact('asset_type'),
                AllowedFilter::exact('risk_level'),
                AllowedFilter::exact('funding_status'),
                AllowedFilter::partial('title'),
                AllowedFilter::scope('featured'),
            ])
            ->allowedSorts(['published_at', 'target_yield', 'term_months', 'min_investment', 'current_amount'])
            ->defaultSort('-published_at')
            ->paginate(min($perPage, 24))
            ->withQueryString();
    }
}
