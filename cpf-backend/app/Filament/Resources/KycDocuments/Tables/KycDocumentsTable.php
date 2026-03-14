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
                TextColumn::make('kind')->badge(),
                TextColumn::make('status')->badge(),
                TextColumn::make('original_name')->searchable(),
                TextColumn::make('created_at')->dateTime(),
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
