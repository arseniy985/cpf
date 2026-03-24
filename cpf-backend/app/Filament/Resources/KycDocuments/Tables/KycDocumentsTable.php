<?php

namespace App\Filament\Resources\KycDocuments\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class KycDocumentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('kycProfile.user.email')->label('Пользователь')->searchable(),
                TextColumn::make('kind')
                    ->label('Тип документа')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'passport' => 'Паспорт',
                        'tax_id' => 'ИНН',
                        'address_proof' => 'Подтверждение адреса',
                        'company_docs' => 'Документы компании',
                        'other' => 'Прочее',
                        default => $state,
                    }),
                TextColumn::make('status')
                    ->label('Статус')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending_review' => 'На проверке',
                        'approved' => 'Одобрен',
                        'rejected' => 'Отклонён',
                        default => $state,
                    }),
                TextColumn::make('original_name')->label('Файл')->searchable(),
                TextColumn::make('created_at')->label('Загружен')->dateTime(),
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Одобрить')
                    ->action(fn ($record) => $record->update([
                        'status' => 'approved',
                        'reviewed_at' => now(),
                        'reviewed_by' => auth()->id(),
                    ])),
                Action::make('reject')
                    ->label('Отклонить')
                    ->color('danger')
                    ->form([
                        Textarea::make('review_comment')->label('Причина')->required(),
                    ])
                    ->action(fn ($record, array $data) => $record->update([
                        'status' => 'rejected',
                        'review_comment' => $data['review_comment'],
                        'reviewed_at' => now(),
                        'reviewed_by' => auth()->id(),
                    ])),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
