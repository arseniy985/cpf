<?php

namespace App\Filament\Resources\LegalDocuments;

use App\Filament\Resources\LegalDocuments\Pages\ManageLegalDocuments;
use App\Filament\Resources\LegalDocuments\Schemas\LegalDocumentForm;
use App\Filament\Resources\LegalDocuments\Tables\LegalDocumentsTable;
use App\Modules\Content\Domain\Models\LegalDocument;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class LegalDocumentResource extends Resource
{
    protected static ?string $model = LegalDocument::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedScale;

    protected static string|UnitEnum|null $navigationGroup = 'Контент';

    protected static ?string $navigationLabel = 'Юридические документы';

    protected static ?string $modelLabel = 'юридический документ';

    protected static ?string $pluralModelLabel = 'Юридические документы';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return LegalDocumentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LegalDocumentsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageLegalDocuments::route('/'),
        ];
    }
}
