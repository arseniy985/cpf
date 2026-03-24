<?php

namespace App\Filament\Resources\WithdrawalRequests\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class WithdrawalRequestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.email')->label('Пользователь')->searchable(),
                TextColumn::make('amount')->label('Сумма')->numeric(),
                TextColumn::make('status')
                    ->label('Статус')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending_review' => 'На проверке',
                        'approved' => 'Одобрено',
                        'rejected' => 'Отклонено',
                        'processing_manual_payout' => 'Ручная выплата',
                        'paid' => 'Выплачено',
                        'failed' => 'Ошибка',
                        'cancelled' => 'Отменено',
                        default => $state,
                    }),
                TextColumn::make('bank_name')->label('Банк'),
                TextColumn::make('created_at')->label('Создана')->dateTime(),
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Одобрить')
                    ->form([
                        Textarea::make('review_note')->label('Комментарий')->required(),
                    ])
                    ->action(fn ($record, array $data) => $record->update([
                        'status' => 'approved',
                        'review_note' => $data['review_note'],
                        'reviewed_at' => now(),
                        'reviewed_by' => auth()->id(),
                    ])),
                Action::make('mark_paid')
                    ->label('Пометить выплаченным')
                    ->form([
                        Textarea::make('review_note')->label('Комментарий')->required(),
                    ])
                    ->action(function ($record, array $data): void {
                        $record->update([
                            'status' => 'paid',
                            'paid_at' => now(),
                            'review_note' => $data['review_note'],
                            'reviewed_by' => auth()->id(),
                        ]);

                        $record->walletTransaction?->update(['status' => 'posted']);
                    }),
                Action::make('reject')
                    ->label('Отклонить')
                    ->color('danger')
                    ->form([
                        Textarea::make('review_note')->label('Причина отказа')->required(),
                    ])
                    ->action(function ($record, array $data): void {
                        $record->update([
                            'status' => 'rejected',
                            'review_note' => $data['review_note'],
                            'reviewed_at' => now(),
                            'reviewed_by' => auth()->id(),
                        ]);

                        $record->walletTransaction?->update(['status' => 'voided']);
                    }),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
