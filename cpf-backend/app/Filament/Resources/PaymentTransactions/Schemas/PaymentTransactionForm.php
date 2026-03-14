<?php

namespace App\Filament\Resources\PaymentTransactions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PaymentTransactionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'email')
                    ->searchable()
                    ->preload(),
                Select::make('gateway')
                    ->options([
                        'yookassa' => 'YooKassa',
                    ])
                    ->required(),
                Select::make('type')
                    ->options([
                        'deposit' => 'Пополнение',
                    ])
                    ->required(),
                Select::make('status')
                    ->options([
                        'pending' => 'Ожидает оплаты',
                        'waiting_for_capture' => 'Ожидает подтверждения',
                        'succeeded' => 'Успешно',
                        'canceled' => 'Отменено',
                    ])
                    ->required(),
                TextInput::make('amount')
                    ->numeric()
                    ->minValue(1000)
                    ->required(),
                TextInput::make('currency')
                    ->default('RUB')
                    ->required(),
                TextInput::make('external_id')
                    ->maxLength(191),
                TextInput::make('confirmation_url')
                    ->url()
                    ->maxLength(500),
                KeyValue::make('payload'),
                DateTimePicker::make('processed_at'),
            ]);
    }
}
