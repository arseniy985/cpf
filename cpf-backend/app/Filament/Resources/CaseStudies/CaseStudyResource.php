<?php

namespace App\Filament\Resources\CaseStudies;

use App\Filament\Resources\CaseStudies\Pages\ManageCaseStudies;
use App\Filament\Resources\CaseStudies\Schemas\CaseStudyForm;
use App\Filament\Resources\CaseStudies\Tables\CaseStudiesTable;
use App\Modules\Content\Domain\Models\CaseStudy;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class CaseStudyResource extends Resource
{
    protected static ?string $model = CaseStudy::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPresentationChartLine;

    protected static string|UnitEnum|null $navigationGroup = 'Контент';

    protected static ?string $navigationLabel = 'Кейсы';

    protected static ?string $modelLabel = 'кейс';

    protected static ?string $pluralModelLabel = 'Кейсы';

    public static function form(Schema $schema): Schema
    {
        return CaseStudyForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CaseStudiesTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageCaseStudies::route('/'),
        ];
    }
}
