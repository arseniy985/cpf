<?php

namespace App\Filament\Resources\PaymentTransactions;

use App\Filament\Resources\PaymentTransactions\Pages\ManagePaymentTransactions;
use App\Filament\Resources\PaymentTransactions\Schemas\PaymentTransactionForm;
use App\Filament\Resources\PaymentTransactions\Tables\PaymentTransactionsTable;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class PaymentTransactionResource extends Resource
{
    protected static ?string $model = PaymentTransaction::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCreditCard;

    protected static string|UnitEnum|null $navigationGroup = 'Инвестиции';

    protected static ?string $navigationLabel = 'Платежи';

    protected static ?string $modelLabel = 'платеж';

    protected static ?string $pluralModelLabel = 'Платежи';

    protected static ?string $recordTitleAttribute = 'external_id';

    public static function form(Schema $schema): Schema
    {
        return PaymentTransactionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PaymentTransactionsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManagePaymentTransactions::route('/'),
        ];
    }
}
