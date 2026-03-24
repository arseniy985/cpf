<?php

namespace App\Filament\Resources\OwnerOnboardings;

use App\Filament\Resources\OwnerOnboardings\Pages\ManageOwnerOnboardings;
use App\Filament\Resources\OwnerOnboardings\Schemas\OwnerOnboardingForm;
use App\Filament\Resources\OwnerOnboardings\Tables\OwnerOnboardingsTable;
use App\Modules\Origination\Domain\Models\OwnerOnboarding;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class OwnerOnboardingResource extends Resource
{
    protected static ?string $model = OwnerOnboarding::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentCheck;

    protected static string|UnitEnum|null $navigationGroup = 'Заявки и проверки';

    protected static ?string $navigationLabel = 'Проверка компаний';

    protected static ?string $modelLabel = 'проверка компании';

    protected static ?string $pluralModelLabel = 'Проверка компаний';

    protected static ?int $navigationSort = 30;

    public static function form(Schema $schema): Schema
    {
        return OwnerOnboardingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OwnerOnboardingsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageOwnerOnboardings::route('/'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::query()->where('status', 'kyb_under_review')->count();

        return $count > 0 ? (string) $count : null;
    }
}
