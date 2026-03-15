<?php

namespace App\Filament\Resources\ManualDepositRequests;

use App\Filament\Resources\ManualDepositRequests\Pages\ManageManualDepositRequests;
use App\Filament\Resources\ManualDepositRequests\Schemas\ManualDepositRequestForm;
use App\Filament\Resources\ManualDepositRequests\Tables\ManualDepositRequestsTable;
use App\Modules\Payments\Domain\Models\ManualDepositRequest;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ManualDepositRequestResource extends Resource
{
    protected static ?string $model = ManualDepositRequest::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingLibrary;

    protected static string|UnitEnum|null $navigationGroup = 'Операции';

    protected static ?string $navigationLabel = 'Ручные пополнения';

    protected static ?string $modelLabel = 'заявка на пополнение';

    protected static ?string $pluralModelLabel = 'Ручные пополнения';

    public static function form(Schema $schema): Schema
    {
        return ManualDepositRequestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ManualDepositRequestsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageManualDepositRequests::route('/'),
        ];
    }
}
