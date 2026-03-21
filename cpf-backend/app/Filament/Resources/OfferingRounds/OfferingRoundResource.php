<?php

namespace App\Filament\Resources\OfferingRounds;

use App\Filament\Resources\OfferingRounds\Pages\ManageOfferingRounds;
use App\Filament\Resources\OfferingRounds\Schemas\OfferingRoundForm;
use App\Filament\Resources\OfferingRounds\Tables\OfferingRoundsTable;
use App\Modules\Origination\Domain\Models\OfferingRound;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class OfferingRoundResource extends Resource
{
    protected static ?string $model = OfferingRound::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPresentationChartLine;

    protected static string|UnitEnum|null $navigationGroup = 'Инвестиции';

    protected static ?string $navigationLabel = 'Раунды';

    protected static ?string $modelLabel = 'раунд';

    protected static ?string $pluralModelLabel = 'Раунды';

    public static function form(Schema $schema): Schema
    {
        return OfferingRoundForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OfferingRoundsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageOfferingRounds::route('/'),
        ];
    }
}
