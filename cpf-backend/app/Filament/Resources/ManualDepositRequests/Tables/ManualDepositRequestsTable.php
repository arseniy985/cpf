<?php

namespace App\Filament\Resources\ManualDepositRequests\Tables;

use App\Modules\Payments\Services\ManualDepositReviewService;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ManualDepositRequestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.email')->label('Пользователь')->searchable(),
                TextColumn::make('reference_code')->label('Код')->searchable()->copyable(),
                TextColumn::make('amount')->label('Сумма')->numeric()->sortable(),
                TextColumn::make('payer_name')->label('Плательщик')->searchable(),
                TextColumn::make('payer_bank')->label('Банк плательщика')->toggleable(),
                TextColumn::make('status')
                    ->label('Статус')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'awaiting_transfer' => 'Ожидает перевода',
                        'under_review' => 'На проверке',
                        'awaiting_user_clarification' => 'Ждёт уточнение от пользователя',
                        'approved' => 'Подтверждено',
                        'credited' => 'Зачислено',
                        'rejected' => 'Отклонено',
                        'cancelled' => 'Отменено',
                        'expired' => 'Истекло',
                        default => $state,
                    }),
                TextColumn::make('receipt_uploaded_at')->label('Чек')->dateTime()->placeholder('Нет'),
                TextColumn::make('created_at')->label('Создана')->dateTime()->sortable(),
            ])
            ->recordActions([
                Action::make('download_receipt')
                    ->label('Скачать чек')
                    ->visible(fn ($record): bool => $record->receipt_path !== null)
                    ->url(fn ($record): string => route('manual-deposits.receipt.download', $record), shouldOpenInNewTab: true),
                Action::make('take_review')
                    ->label('Взять в работу')
                    ->visible(fn ($record): bool => in_array($record->status, ['awaiting_transfer', 'under_review'], true))
                    ->form([
                        Textarea::make('review_note')->label('Комментарий')->rows(3),
                    ])
                    ->action(fn ($record, array $data) => app(ManualDepositReviewService::class)->markUnderReview(
                        $record,
                        auth()->user(),
                        $data['review_note'] ?? null,
                    )),
                Action::make('request_clarification')
                    ->label('Запросить уточнение')
                    ->color('warning')
                    ->visible(fn ($record): bool => in_array($record->status, ['awaiting_transfer', 'under_review', 'approved'], true))
                    ->form([
                        Textarea::make('review_note')->label('Что уточнить')->required()->rows(4),
                    ])
                    ->action(fn ($record, array $data) => app(ManualDepositReviewService::class)->requestClarification(
                        $record,
                        auth()->user(),
                        $data['review_note'],
                    )),
                Action::make('approve')
                    ->label('Подтвердить заявку')
                    ->visible(fn ($record): bool => in_array($record->status, ['under_review', 'awaiting_user_clarification'], true))
                    ->form([
                        Textarea::make('review_note')->label('Комментарий')->required()->rows(4),
                    ])
                    ->action(fn ($record, array $data) => app(ManualDepositReviewService::class)->approve(
                        $record,
                        auth()->user(),
                        $data['review_note'],
                    )),
                Action::make('credit')
                    ->label('Зачислить средства')
                    ->color('success')
                    ->visible(fn ($record): bool => in_array($record->status, ['approved', 'under_review'], true))
                    ->form([
                        Textarea::make('review_note')->label('Комментарий к зачислению')->required()->rows(4),
                    ])
                    ->action(fn ($record, array $data) => app(ManualDepositReviewService::class)->credit(
                        $record,
                        auth()->user(),
                        $data['review_note'],
                    )),
                Action::make('reject')
                    ->label('Отклонить')
                    ->color('danger')
                    ->visible(fn ($record): bool => ! in_array($record->status, ['credited', 'rejected', 'cancelled'], true))
                    ->form([
                        Textarea::make('review_note')->label('Причина отказа')->required()->rows(4),
                    ])
                    ->action(fn ($record, array $data) => app(ManualDepositReviewService::class)->reject(
                        $record,
                        auth()->user(),
                        $data['review_note'],
                    )),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
