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
                    ->label('Пользователь')
                    ->relationship('user', 'email')
                    ->searchable()
                    ->preload(),
                Select::make('gateway')
                    ->label('Платёжный шлюз')
                    ->options([
                        'yookassa' => 'YooKassa',
                    ])
                    ->required(),
                Select::make('type')
                    ->label('Тип операции')
                    ->options([
                        'deposit' => 'Пополнение',
                    ])
                    ->required(),
                Select::make('status')
                    ->label('Статус операции')
                    ->options([
                        'pending' => 'Ожидает оплаты',
                        'waiting_for_capture' => 'Ожидает подтверждения',
                        'succeeded' => 'Успешно',
                        'canceled' => 'Отменено',
                    ])
                    ->required(),
                TextInput::make('amount')
                    ->label('Сумма')
                    ->numeric()
                    ->minValue(1000)
                    ->required(),
                TextInput::make('currency')
                    ->label('Валюта')
                    ->default('RUB')
                    ->required(),
                TextInput::make('external_id')
                    ->label('Внешний ID')
                    ->maxLength(191),
                TextInput::make('confirmation_url')
                    ->label('Ссылка на оплату')
                    ->url()
                    ->maxLength(500),
                KeyValue::make('payload')->label('Служебные данные'),
                DateTimePicker::make('processed_at')->label('Обработана'),
            ]);
    }
}
