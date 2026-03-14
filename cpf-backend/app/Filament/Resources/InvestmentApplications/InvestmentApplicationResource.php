<?php

namespace App\Filament\Resources\InvestmentApplications;

use App\Filament\Resources\InvestmentApplications\Pages\ManageInvestmentApplications;
use App\Filament\Resources\InvestmentApplications\Schemas\InvestmentApplicationForm;
use App\Filament\Resources\InvestmentApplications\Tables\InvestmentApplicationsTable;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class InvestmentApplicationResource extends Resource
{
    protected static ?string $model = InvestmentApplication::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBanknotes;

    protected static string|UnitEnum|null $navigationGroup = 'Инвестиции';

    protected static ?string $navigationLabel = 'Заявки инвесторов';

    protected static ?string $modelLabel = 'заявка инвестора';

    protected static ?string $pluralModelLabel = 'Заявки инвесторов';

    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Schema $schema): Schema
    {
        return InvestmentApplicationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return InvestmentApplicationsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageInvestmentApplications::route('/'),
        ];
    }
}
