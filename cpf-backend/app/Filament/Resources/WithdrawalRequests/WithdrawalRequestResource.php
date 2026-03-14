<?php

namespace App\Filament\Resources\WithdrawalRequests;

use App\Filament\Resources\WithdrawalRequests\Pages\ManageWithdrawalRequests;
use App\Filament\Resources\WithdrawalRequests\Schemas\WithdrawalRequestForm;
use App\Filament\Resources\WithdrawalRequests\Tables\WithdrawalRequestsTable;
use App\Modules\Payments\Domain\Models\WithdrawalRequest;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class WithdrawalRequestResource extends Resource
{
    protected static ?string $model = WithdrawalRequest::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBanknotes;

    protected static string|UnitEnum|null $navigationGroup = 'Операции';

    protected static ?string $navigationLabel = 'Заявки на вывод';

    protected static ?string $modelLabel = 'заявка на вывод';

    protected static ?string $pluralModelLabel = 'Заявки на вывод';

    public static function form(Schema $schema): Schema
    {
        return WithdrawalRequestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return WithdrawalRequestsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageWithdrawalRequests::route('/'),
        ];
    }
}
