<?php

namespace App\Filament\Resources\InvestmentApplications\Pages;

use App\Filament\Resources\InvestmentApplications\InvestmentApplicationResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditInvestmentApplication extends EditRecord
{
    protected static string $resource = InvestmentApplicationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
