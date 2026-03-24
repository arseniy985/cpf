<?php

namespace App\Filament\Resources\StaticPages\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class StaticPageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('key')->label('Ключ страницы')->required(),
            TextInput::make('title')->label('Заголовок в админке')->required(),
            TextInput::make('headline')->label('Главный заголовок'),
            Textarea::make('summary')->label('Краткое описание')->rows(3),
            Textarea::make('body')->label('Текст страницы')->rows(10),
            Toggle::make('is_published')->label('Опубликована'),
        ]);
    }
}
