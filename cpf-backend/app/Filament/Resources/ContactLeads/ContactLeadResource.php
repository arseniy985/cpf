<?php

namespace App\Filament\Resources\ContactLeads;

use App\Filament\Resources\ContactLeads\Pages\ManageContactLeads;
use App\Filament\Resources\ContactLeads\Schemas\ContactLeadForm;
use App\Filament\Resources\ContactLeads\Tables\ContactLeadsTable;
use App\Modules\CRM\Domain\Models\ContactLead;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ContactLeadResource extends Resource
{
    protected static ?string $model = ContactLead::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static string|UnitEnum|null $navigationGroup = 'CRM';

    protected static ?string $navigationLabel = 'Лиды инвесторов';

    protected static ?string $modelLabel = 'лид';

    protected static ?string $pluralModelLabel = 'Лиды';

    protected static ?string $recordTitleAttribute = 'full_name';

    public static function form(Schema $schema): Schema
    {
        return ContactLeadForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ContactLeadsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageContactLeads::route('/'),
        ];
    }
}
