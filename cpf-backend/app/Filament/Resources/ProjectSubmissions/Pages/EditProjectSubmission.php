<?php

namespace App\Filament\Resources\ProjectSubmissions\Pages;

use App\Filament\Resources\ProjectSubmissions\ProjectSubmissionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditProjectSubmission extends EditRecord
{
    protected static string $resource = ProjectSubmissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
