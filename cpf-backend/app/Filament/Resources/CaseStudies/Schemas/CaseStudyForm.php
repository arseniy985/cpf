<?php

namespace App\Filament\Resources\CaseStudies\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CaseStudyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('slug')->label('Slug')->required(),
            TextInput::make('title')->label('Заголовок')->required(),
            Textarea::make('excerpt')->label('Краткое описание')->rows(3)->required(),
            Textarea::make('body')->label('Текст кейса')->rows(10)->required(),
            TextInput::make('result_metric')->label('Ключевой результат'),
            Toggle::make('is_published')->label('Опубликован'),
            DateTimePicker::make('published_at')->label('Дата публикации'),
        ]);
    }
}
