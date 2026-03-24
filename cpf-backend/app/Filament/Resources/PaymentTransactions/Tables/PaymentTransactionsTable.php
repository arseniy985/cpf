<?php

namespace App\Filament\Resources\PaymentTransactions\Tables;

use App\Modules\Payments\Services\PaymentSyncService;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PaymentTransactionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.email')
                    ->label('Инвестор')
                    ->searchable(),
                TextColumn::make('gateway')
                    ->label('Шлюз')
                    ->badge(),
                TextColumn::make('type')
                    ->label('Тип')
                    ->badge(),
                TextColumn::make('status')
                    ->label('Статус')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'Ожидает оплаты',
                        'waiting_for_capture' => 'Ожидает подтверждения',
                        'succeeded' => 'Успешно',
                        'canceled' => 'Отменено',
                        default => $state,
                    }),
                TextColumn::make('amount')
                    ->numeric()
                    ->label('Сумма')
                    ->sortable(),
                TextColumn::make('currency')->label('Валюта'),
                TextColumn::make('external_id')
                    ->label('Внешний ID')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),
                TextColumn::make('processed_at')
                    ->label('Обработана')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Создана')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                Action::make('sync')
                    ->label('Синхронизировать')
                    ->action(fn ($record) => app(PaymentSyncService::class)->syncByExternalId($record->external_id)),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
