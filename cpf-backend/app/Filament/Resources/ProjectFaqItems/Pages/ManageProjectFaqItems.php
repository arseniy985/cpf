<?php

namespace App\Filament\Resources\ProjectFaqItems\Pages;

use App\Filament\Resources\ProjectFaqItems\ProjectFaqItemResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageProjectFaqItems extends ManageRecords
{
    protected static string $resource = ProjectFaqItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
