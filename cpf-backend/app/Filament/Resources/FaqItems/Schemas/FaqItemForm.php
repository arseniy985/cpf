<?php

namespace App\Filament\Resources\FaqItems\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class FaqItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('group_name')
                    ->label('Группа')
                    ->required(),
                TextInput::make('question')
                    ->label('Вопрос')
                    ->required()
                    ->maxLength(255),
                Textarea::make('answer')
                    ->label('Ответ')
                    ->required()
                    ->rows(5),
                TextInput::make('sort_order')
                    ->label('Порядок')
                    ->numeric()
                    ->required(),
                Toggle::make('is_published')
                    ->label('Опубликован')
                    ->required(),
            ]);
    }
}
