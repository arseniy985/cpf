<?php

namespace App\Filament\Resources\ProjectFaqItems;

use App\Filament\Resources\ProjectFaqItems\Pages\ManageProjectFaqItems;
use App\Filament\Resources\ProjectFaqItems\Schemas\ProjectFaqItemForm;
use App\Filament\Resources\ProjectFaqItems\Tables\ProjectFaqItemsTable;
use App\Modules\Catalog\Domain\Models\ProjectFaqItem;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ProjectFaqItemResource extends Resource
{
    protected static ?string $model = ProjectFaqItem::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQuestionMarkCircle;

    protected static string|UnitEnum|null $navigationGroup = 'Сделки и проекты';

    protected static ?string $navigationLabel = 'FAQ проектов';

    protected static ?string $modelLabel = 'FAQ проекта';

    protected static ?string $pluralModelLabel = 'FAQ проектов';

    protected static ?int $navigationSort = 50;

    public static function form(Schema $schema): Schema
    {
        return ProjectFaqItemForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ProjectFaqItemsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageProjectFaqItems::route('/'),
        ];
    }
}
