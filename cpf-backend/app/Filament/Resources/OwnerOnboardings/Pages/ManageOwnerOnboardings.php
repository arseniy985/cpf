<?php

namespace App\Filament\Resources\OwnerOnboardings\Pages;

use App\Filament\Resources\OwnerOnboardings\OwnerOnboardingResource;
use Filament\Resources\Pages\ManageRecords;

class ManageOwnerOnboardings extends ManageRecords
{
    protected static string $resource = OwnerOnboardingResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
