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
                    ->label('Владелец')
                    ->relationship('owner', 'email')
                    ->searchable(),
                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->maxLength(160),
                TextInput::make('title')
                    ->label('Название проекта')
                    ->required()
                    ->maxLength(255),
                Textarea::make('excerpt')
                    ->label('Краткое описание')
                    ->required()
                    ->rows(3)
                    ->maxLength(500),
                Textarea::make('description')
                    ->label('Полное описание')
                    ->required()
                    ->rows(6),
                Textarea::make('thesis')
                    ->label('Инвестиционный тезис')
                    ->rows(3),
                Textarea::make('risk_summary')
                    ->label('Риски')
                    ->rows(3),
                TextInput::make('location')
                    ->label('Локация')
                    ->required(),
                Select::make('asset_type')
                    ->label('Тип актива')
                    ->options([
                        'commercial_real_estate' => 'Коммерческая недвижимость',
                        'income_property' => 'Доходный объект',
                        'logistics' => 'Логистика',
                    ])
                    ->required(),
                Select::make('status')
                    ->label('Статус проекта')
                    ->options([
                        'draft' => 'Черновик',
                        'pending_review' => 'На модерации',
                        'published' => 'Опубликован',
                        'archived' => 'Архив',
                    ])
                    ->required(),
                Select::make('funding_status')
                    ->label('Статус сбора')
                    ->options([
                        'preparing' => 'Подготовка',
                        'collecting' => 'Сбор средств',
                        'funded' => 'Сбор завершен',
                    ])
                    ->required(),
                Select::make('risk_level')
                    ->label('Уровень риска')
                    ->options([
                        'low' => 'Низкий',
                        'moderate' => 'Средний',
                        'elevated' => 'Повышенный',
                    ])
                    ->required(),
                Select::make('payout_frequency')
                    ->label('Частота выплат')
                    ->options([
                        'monthly' => 'Ежемесячно',
                        'quarterly' => 'Ежеквартально',
                        'at_exit' => 'На выходе',
                    ])
                    ->required(),
                TextInput::make('min_investment')
                    ->label('Минимальная инвестиция')
                    ->numeric()
                    ->minValue(10000)
                    ->required(),
                TextInput::make('target_amount')
                    ->label('Цель сбора')
                    ->numeric()
                    ->required(),
                TextInput::make('current_amount')
                    ->label('Собрано')
                    ->numeric()
                    ->required(),
                TextInput::make('target_yield')
                    ->label('Целевая доходность')
                    ->numeric()
                    ->required(),
                TextInput::make('term_months')
                    ->label('Срок, месяцев')
                    ->numeric()
                    ->required(),
                TextInput::make('cover_image_url')
                    ->label('Обложка')
                    ->url(),
                TextInput::make('hero_metric')->label('Главная метрика'),
                Toggle::make('is_featured')->label('Показывать в подборке'),
                DateTimePicker::make('published_at')->label('Дата публикации'),
            ]);
    }
}
