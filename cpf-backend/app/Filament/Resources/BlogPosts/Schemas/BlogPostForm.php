<?php

namespace App\Filament\Resources\BlogPosts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class BlogPostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('category_id')->label('Категория')->relationship('category', 'name')->searchable(),
            TextInput::make('slug')->label('Slug')->required(),
            TextInput::make('title')->label('Заголовок')->required(),
            Textarea::make('excerpt')->label('Краткое описание')->rows(3)->required(),
            Textarea::make('body')->label('Текст публикации')->rows(10)->required(),
            TagsInput::make('tags')->label('Теги'),
            Toggle::make('is_published')->label('Опубликована'),
            DateTimePicker::make('published_at')->label('Дата публикации'),
        ]);
    }
}
