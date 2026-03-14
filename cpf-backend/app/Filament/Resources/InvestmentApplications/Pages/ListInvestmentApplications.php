<?php

namespace App\Filament\Resources\InvestmentApplications\Pages;

use App\Filament\Resources\InvestmentApplications\InvestmentApplicationResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListInvestmentApplications extends ListRecords
{
    protected static string $resource = InvestmentApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
