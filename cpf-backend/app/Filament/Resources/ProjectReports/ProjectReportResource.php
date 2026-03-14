<?php

namespace App\Filament\Resources\ProjectReports;

use App\Filament\Resources\ProjectReports\Pages\ManageProjectReports;
use App\Filament\Resources\ProjectReports\Schemas\ProjectReportForm;
use App\Filament\Resources\ProjectReports\Tables\ProjectReportsTable;
use App\Modules\Origination\Domain\Models\ProjectReport;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ProjectReportResource extends Resource
{
    protected static ?string $model = ProjectReport::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static string|UnitEnum|null $navigationGroup = 'Сделки';

    protected static ?string $navigationLabel = 'Отчеты проектов';

    protected static ?string $modelLabel = 'отчет проекта';

    protected static ?string $pluralModelLabel = 'Отчеты проектов';

    public static function form(Schema $schema): Schema
    {
        return ProjectReportForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ProjectReportsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageProjectReports::route('/'),
        ];
    }
}
