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

    protected static string|UnitEnum|null $navigationGroup = 'Контроль';

    protected static ?string $navigationLabel = 'Owner KYB';

    protected static ?string $modelLabel = 'owner onboarding';

    protected static ?string $pluralModelLabel = 'Owner KYB';

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
}
