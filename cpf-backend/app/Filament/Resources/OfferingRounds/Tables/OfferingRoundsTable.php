<?php

namespace App\Filament\Resources\OfferingRounds\Tables;

use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Origination\Services\AdminOfferingRoundService;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

class OfferingRoundsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->with(['project', 'ownerAccount.onboarding']))
            ->defaultSort('updated_at', 'desc')
            ->columns([
                TextColumn::make('title')
                    ->label('Раунд')
                    ->searchable(),
                TextColumn::make('project.title')
                    ->label('Проект')
                    ->searchable(),
                TextColumn::make('ownerAccount.display_name')
                    ->label('Кабинет')
                    ->searchable(),
                TextColumn::make('status')
                    ->label('Статус')
                    ->badge(),
                TextColumn::make('ownerAccount.onboarding.status')
                    ->label('Проверка компании')
                    ->badge(),
                TextColumn::make('target_amount')
                    ->label('Цель')
                    ->numeric(),
                TextColumn::make('current_amount')
                    ->label('Собрано')
                    ->numeric(),
                TextColumn::make('review_submitted_at')
                    ->label('На проверке с')
                    ->dateTime(),
                TextColumn::make('went_live_at')
                    ->label('Опубликован')
                    ->dateTime(),
            ])
            ->recordActions([
                Action::make('markReady')
                    ->label('Готово к публикации')
                    ->color('info')
                    ->visible(fn (OfferingRound $record): bool => in_array($record->status, ['draft', 'pending_review', 'revision_requested'], true))
                    ->action(fn (OfferingRound $record) => app(AdminOfferingRoundService::class)->markReady($record)),
                Action::make('requestRevision')
                    ->label('Вернуть на доработку')
                    ->color('warning')
                    ->visible(fn (OfferingRound $record): bool => ! in_array($record->status, ['live', 'fully_allocated', 'closed'], true))
                    ->schema([
                        Textarea::make('reason')
                            ->label('Комментарий для владельца')
                            ->required(),
                    ])
                    ->action(function (OfferingRound $record, array $data): void {
                        $reason = trim((string) ($data['reason'] ?? ''));

                        if ($reason === '') {
                            throw ValidationException::withMessages([
                                'reason' => ['Укажите причину возврата.'],
                            ]);
                        }

                        app(AdminOfferingRoundService::class)->requestRevision($record, $reason);
                    }),
                Action::make('goLive')
                    ->label('Опубликовать')
                    ->color('success')
                    ->visible(fn (OfferingRound $record): bool => in_array($record->status, ['pending_review', 'ready'], true))
                    ->action(fn (OfferingRound $record) => app(AdminOfferingRoundService::class)->goLive($record)),
                Action::make('close')
                    ->label('Закрыть')
                    ->color('danger')
                    ->visible(fn (OfferingRound $record): bool => in_array($record->status, ['live', 'fully_allocated'], true))
                    ->action(fn (OfferingRound $record) => app(AdminOfferingRoundService::class)->close($record)),
            ]);
    }
}
