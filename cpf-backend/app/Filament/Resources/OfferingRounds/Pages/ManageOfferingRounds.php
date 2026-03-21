<?php

namespace App\Filament\Resources\OfferingRounds\Pages;

use App\Filament\Resources\OfferingRounds\OfferingRoundResource;
use Filament\Resources\Pages\ManageRecords;

class ManageOfferingRounds extends ManageRecords
{
    protected static string $resource = OfferingRoundResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
