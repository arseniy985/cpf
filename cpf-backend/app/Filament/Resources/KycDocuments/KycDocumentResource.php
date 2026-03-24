<?php

namespace App\Filament\Resources\KycDocuments;

use App\Filament\Resources\KycDocuments\Pages\ManageKycDocuments;
use App\Filament\Resources\KycDocuments\Schemas\KycDocumentForm;
use App\Filament\Resources\KycDocuments\Tables\KycDocumentsTable;
use App\Modules\Compliance\Domain\Models\KycDocument;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class KycDocumentResource extends Resource
{
    protected static ?string $model = KycDocument::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPaperClip;

    protected static string|UnitEnum|null $navigationGroup = 'Заявки и проверки';

    protected static ?string $navigationLabel = 'Документы инвесторов';

    protected static ?string $modelLabel = 'документ инвестора';

    protected static ?string $pluralModelLabel = 'Документы инвесторов';

    protected static ?int $navigationSort = 20;

    public static function form(Schema $schema): Schema
    {
        return KycDocumentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return KycDocumentsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageKycDocuments::route('/'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::query()->where('status', 'pending_review')->count();

        return $count > 0 ? (string) $count : null;
    }
}
