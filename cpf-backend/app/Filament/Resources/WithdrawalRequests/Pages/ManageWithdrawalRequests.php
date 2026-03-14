<?php

namespace App\Filament\Resources\WithdrawalRequests\Pages;

use App\Filament\Resources\WithdrawalRequests\WithdrawalRequestResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageWithdrawalRequests extends ManageRecords
{
    protected static string $resource = WithdrawalRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
