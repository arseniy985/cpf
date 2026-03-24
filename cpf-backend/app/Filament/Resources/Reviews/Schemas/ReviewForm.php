<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('author_name')->label('Автор')->required(),
            TextInput::make('author_role')->label('Роль автора'),
            TextInput::make('company_name')->label('Компания'),
            TextInput::make('rating')->label('Оценка')->numeric()->minValue(1)->maxValue(5)->required(),
            Textarea::make('body')->label('Текст отзыва')->rows(4)->required(),
            TextInput::make('sort_order')->label('Порядок')->numeric()->default(0),
            Toggle::make('is_published')->label('Опубликован'),
        ]);
    }
}
