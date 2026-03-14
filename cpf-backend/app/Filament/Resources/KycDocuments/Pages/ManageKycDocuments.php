<?php

namespace App\Filament\Resources\KycDocuments\Pages;

use App\Filament\Resources\KycDocuments\KycDocumentResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageKycDocuments extends ManageRecords
{
    protected static string $resource = KycDocumentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
