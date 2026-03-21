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
                ->required(),
            TextInput::make('slug')
                ->required(),
            Select::make('status')
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
                ->numeric()
                ->required(),
            TextInput::make('current_amount')
                ->numeric()
                ->required(),
            TextInput::make('min_investment')
                ->numeric()
                ->required(),
            DateTimePicker::make('review_submitted_at'),
            DateTimePicker::make('opens_at'),
            DateTimePicker::make('went_live_at'),
            DateTimePicker::make('closed_at'),
            Textarea::make('notes')
                ->rows(5),
        ]);
    }
}
