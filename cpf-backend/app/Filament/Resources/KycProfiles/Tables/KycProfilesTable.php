<?php

namespace App\Filament\Resources\KycProfiles\Tables;

use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class KycProfilesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.email')->label('Пользователь')->searchable(),
                TextColumn::make('legal_name')->label('ФИО')->searchable(),
                TextColumn::make('status')
                    ->label('Статус')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'draft' => 'Черновик',
                        'pending_review' => 'На проверке',
                        'approved' => 'Одобрена',
                        'rejected' => 'Отклонена',
                        default => $state,
                    }),
                TextColumn::make('submitted_at')->label('Отправлена')->dateTime(),
                TextColumn::make('reviewed_at')->label('Проверена')->dateTime(),
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
                        Textarea::make('notes')->label('Причина отклонения')->required(),
                    ])
                    ->action(fn ($record, array $data) => $record->update([
                        'status' => 'rejected',
                        'notes' => $data['notes'],
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
