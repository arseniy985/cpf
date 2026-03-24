<?php

namespace App\Filament\Resources\FaqItems;

use App\Filament\Resources\FaqItems\Pages\ManageFaqItems;
use App\Filament\Resources\FaqItems\Schemas\FaqItemForm;
use App\Filament\Resources\FaqItems\Tables\FaqItemsTable;
use App\Modules\Content\Domain\Models\FaqItem;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class FaqItemResource extends Resource
{
    protected static ?string $model = FaqItem::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQuestionMarkCircle;

    protected static string|UnitEnum|null $navigationGroup = 'Сайт и контент';

    protected static ?string $navigationLabel = 'FAQ сайта';

    protected static ?string $modelLabel = 'вопрос FAQ';

    protected static ?string $pluralModelLabel = 'FAQ сайта';

    protected static ?string $recordTitleAttribute = 'question';

    protected static ?int $navigationSort = 20;

    public static function form(Schema $schema): Schema
    {
        return FaqItemForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FaqItemsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageFaqItems::route('/'),
        ];
    }
}
