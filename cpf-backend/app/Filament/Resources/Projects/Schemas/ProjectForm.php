<?php

namespace App\Filament\Resources\Projects\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('owner_id')
                    ->relationship('owner', 'email')
                    ->searchable(),
                TextInput::make('slug')
                    ->required()
                    ->maxLength(160),
                TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Textarea::make('excerpt')
                    ->required()
                    ->rows(3)
                    ->maxLength(500),
                Textarea::make('description')
                    ->required()
                    ->rows(6),
                Textarea::make('thesis')
                    ->rows(3),
                Textarea::make('risk_summary')
                    ->rows(3),
                TextInput::make('location')
                    ->required(),
                Select::make('asset_type')
                    ->options([
                        'commercial_real_estate' => 'Коммерческая недвижимость',
                        'income_property' => 'Доходный объект',
                        'logistics' => 'Логистика',
                    ])
                    ->required(),
                Select::make('status')
                    ->options([
                        'draft' => 'Черновик',
                        'pending_review' => 'На модерации',
                        'published' => 'Опубликован',
                        'archived' => 'Архив',
                    ])
                    ->required(),
                Select::make('funding_status')
                    ->options([
                        'preparing' => 'Подготовка',
                        'collecting' => 'Сбор средств',
                        'funded' => 'Сбор завершен',
                    ])
                    ->required(),
                Select::make('risk_level')
                    ->options([
                        'low' => 'Низкий',
                        'moderate' => 'Средний',
                        'elevated' => 'Повышенный',
                    ])
                    ->required(),
                Select::make('payout_frequency')
                    ->options([
                        'monthly' => 'Ежемесячно',
                        'quarterly' => 'Ежеквартально',
                        'at_exit' => 'На выходе',
                    ])
                    ->required(),
                TextInput::make('min_investment')
                    ->numeric()
                    ->minValue(10000)
                    ->required(),
                TextInput::make('target_amount')
                    ->numeric()
                    ->required(),
                TextInput::make('current_amount')
                    ->numeric()
                    ->required(),
                TextInput::make('target_yield')
                    ->numeric()
                    ->required(),
                TextInput::make('term_months')
                    ->numeric()
                    ->required(),
                TextInput::make('cover_image_url')
                    ->url(),
                TextInput::make('hero_metric'),
                Toggle::make('is_featured'),
                DateTimePicker::make('published_at'),
            ]);
    }
}
