<?php

namespace App\Filament\Resources\ProjectDocuments\Pages;

use App\Filament\Resources\ProjectDocuments\ProjectDocumentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageProjectDocuments extends ManageRecords
{
    protected static string $resource = ProjectDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
