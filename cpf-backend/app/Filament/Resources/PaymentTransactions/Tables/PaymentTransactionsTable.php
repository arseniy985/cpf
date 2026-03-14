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
                    ->badge(),
                TextColumn::make('type')
                    ->badge(),
                TextColumn::make('status')
                    ->badge(),
                TextColumn::make('amount')
                    ->numeric()
                    ->label('Сумма')
                    ->sortable(),
                TextColumn::make('currency'),
                TextColumn::make('external_id')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),
                TextColumn::make('processed_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
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
