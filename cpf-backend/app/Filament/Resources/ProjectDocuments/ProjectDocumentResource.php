<?php

namespace App\Filament\Resources\ProjectDocuments;

use App\Filament\Resources\ProjectDocuments\Pages\ManageProjectDocuments;
use App\Filament\Resources\ProjectDocuments\Schemas\ProjectDocumentForm;
use App\Filament\Resources\ProjectDocuments\Tables\ProjectDocumentsTable;
use App\Modules\Catalog\Domain\Models\ProjectDocument;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ProjectDocumentResource extends Resource
{
    protected static ?string $model = ProjectDocument::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static string|UnitEnum|null $navigationGroup = 'Каталог';

    protected static ?string $navigationLabel = 'Документы проектов';

    protected static ?string $modelLabel = 'документ проекта';

    protected static ?string $pluralModelLabel = 'Документы проектов';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return ProjectDocumentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ProjectDocumentsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageProjectDocuments::route('/'),
        ];
    }
}
