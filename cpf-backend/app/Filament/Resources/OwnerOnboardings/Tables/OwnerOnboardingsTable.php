<?php

namespace App\Filament\Resources\OwnerOnboardings\Tables;

use App\Modules\Origination\Domain\Models\OwnerOnboarding;
use App\Modules\Origination\Services\OwnerOnboardingReviewService;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

class OwnerOnboardingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->with(['ownerAccount.primaryUser']))
            ->defaultSort('updated_at', 'desc')
            ->columns([
                TextColumn::make('ownerAccount.display_name')
                    ->label('Кабинет')
                    ->searchable(),
                TextColumn::make('ownerAccount.primaryUser.email')
                    ->label('Пользователь')
                    ->searchable(),
                TextColumn::make('status')
                    ->badge(),
                TextColumn::make('submitted_at')
                    ->label('Отправлено')
                    ->dateTime(),
                TextColumn::make('reviewed_at')
                    ->label('Проверено')
                    ->dateTime(),
                TextColumn::make('activated_at')
                    ->label('Активировано')
                    ->dateTime(),
            ])
            ->recordActions([
                Action::make('approve')
                    ->label('Одобрить')
                    ->color('success')
                    ->visible(fn (OwnerOnboarding $record): bool => ! in_array($record->status, ['kyb_approved', 'active'], true))
                    ->action(fn (OwnerOnboarding $record) => app(OwnerOnboardingReviewService::class)->approve($record)),
                Action::make('activate')
                    ->label('Активировать')
                    ->color('primary')
                    ->visible(fn (OwnerOnboarding $record): bool => $record->status === 'kyb_approved')
                    ->action(fn (OwnerOnboarding $record) => app(OwnerOnboardingReviewService::class)->activate($record)),
                Action::make('reject')
                    ->label('Отклонить')
                    ->color('danger')
                    ->schema([
                        Textarea::make('reason')
                            ->label('Причина отклонения')
                            ->required(),
                    ])
                    ->action(function (OwnerOnboarding $record, array $data): void {
                        $reason = trim((string) ($data['reason'] ?? ''));

                        if ($reason === '') {
                            throw ValidationException::withMessages([
                                'reason' => ['Укажите причину отклонения.'],
                            ]);
                        }

                        app(OwnerOnboardingReviewService::class)->reject($record, $reason);
                    }),
            ]);
    }
}
