<?php

namespace App\Filament\Resources\ProjectSubmissions\Pages;

use App\Filament\Resources\ProjectSubmissions\ProjectSubmissionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageProjectSubmissions extends ManageRecords
{
    protected static string $resource = ProjectSubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
