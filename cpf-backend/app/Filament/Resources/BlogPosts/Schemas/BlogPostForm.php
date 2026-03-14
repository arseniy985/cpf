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
            Select::make('category_id')->relationship('category', 'name')->searchable(),
            TextInput::make('slug')->required(),
            TextInput::make('title')->required(),
            Textarea::make('excerpt')->rows(3)->required(),
            Textarea::make('body')->rows(10)->required(),
            TagsInput::make('tags'),
            Toggle::make('is_published'),
            DateTimePicker::make('published_at'),
        ]);
    }
}
