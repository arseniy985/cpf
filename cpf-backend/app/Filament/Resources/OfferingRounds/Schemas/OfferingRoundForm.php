<?php

namespace App\Filament\Resources\OfferingRounds\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class OfferingRoundForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')
                ->label('Название раунда')
                ->required(),
            TextInput::make('slug')
                ->label('Slug')
                ->required(),
            Select::make('status')
                ->label('Статус раунда')
                ->options([
                    'draft' => 'Черновик',
                    'pending_review' => 'На проверке',
                    'revision_requested' => 'Нужна доработка',
                    'ready' => 'Готово',
                    'live' => 'Активен',
                    'fully_allocated' => 'Полностью распределен',
                    'closed' => 'Закрыт',
                ])
                ->required(),
            TextInput::make('target_amount')
                ->label('Цель сбора')
                ->numeric()
                ->required(),
            TextInput::make('current_amount')
                ->label('Собрано')
                ->numeric()
                ->required(),
            TextInput::make('min_investment')
                ->label('Минимальная инвестиция')
                ->numeric()
                ->required(),
            DateTimePicker::make('review_submitted_at')->label('Передан на проверку'),
            DateTimePicker::make('opens_at')->label('Открывается'),
            DateTimePicker::make('went_live_at')->label('Опубликован'),
            DateTimePicker::make('closed_at')->label('Закрыт'),
            Textarea::make('notes')
                ->label('Комментарий')
                ->rows(5),
        ]);
    }
}
