<?php

namespace App\Filament\Resources\KycProfiles;

use App\Filament\Resources\KycProfiles\Pages\ManageKycProfiles;
use App\Filament\Resources\KycProfiles\Schemas\KycProfileForm;
use App\Filament\Resources\KycProfiles\Tables\KycProfilesTable;
use App\Modules\Identity\Domain\Models\KycProfile;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class KycProfileResource extends Resource
{
    protected static ?string $model = KycProfile::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedIdentification;

    protected static string|UnitEnum|null $navigationGroup = 'Заявки и проверки';

    protected static ?string $navigationLabel = 'Анкеты инвесторов';

    protected static ?string $modelLabel = 'анкета инвестора';

    protected static ?string $pluralModelLabel = 'Анкеты инвесторов';

    protected static ?int $navigationSort = 10;

    public static function form(Schema $schema): Schema
    {
        return KycProfileForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return KycProfilesTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageKycProfiles::route('/'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::query()->where('status', 'pending_review')->count();

        return $count > 0 ? (string) $count : null;
    }
}
