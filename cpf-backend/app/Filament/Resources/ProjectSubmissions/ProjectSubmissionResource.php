<?php

namespace App\Filament\Resources\ProjectSubmissions;

use App\Filament\Resources\ProjectSubmissions\Pages\ManageProjectSubmissions;
use App\Filament\Resources\ProjectSubmissions\Schemas\ProjectSubmissionForm;
use App\Filament\Resources\ProjectSubmissions\Tables\ProjectSubmissionsTable;
use App\Modules\Origination\Domain\Models\ProjectSubmission;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ProjectSubmissionResource extends Resource
{
    protected static ?string $model = ProjectSubmission::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentList;

    protected static string|UnitEnum|null $navigationGroup = 'CRM';

    protected static ?string $navigationLabel = 'Заявки собственников';

    protected static ?string $modelLabel = 'заявка собственника';

    protected static ?string $pluralModelLabel = 'Заявки собственников';

    protected static ?string $recordTitleAttribute = 'project_name';

    public static function form(Schema $schema): Schema
    {
        return ProjectSubmissionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ProjectSubmissionsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageProjectSubmissions::route('/'),
        ];
    }
}
