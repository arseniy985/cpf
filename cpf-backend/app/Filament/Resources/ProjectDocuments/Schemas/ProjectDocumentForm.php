<?php

namespace App\Filament\Resources\ProjectDocuments\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProjectDocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('project_id')
                    ->label('Проект')
                    ->relationship('project', 'title')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('title')
                    ->label('Название документа')
                    ->required()
                    ->maxLength(255),
                TextInput::make('kind')
                    ->label('Тип документа')
                    ->required()
                    ->maxLength(120),
                TextInput::make('label')
                    ->label('Бейдж')
                    ->maxLength(80),
                TextInput::make('file_url')
                    ->label('Ссылка на файл')
                    ->url()
                    ->required(),
                TextInput::make('sort_order')
                    ->label('Порядок')
                    ->numeric()
                    ->default(0)
                    ->required(),
                Toggle::make('is_public')
                    ->label('Доступен публично')
                    ->default(true)
                    ->required(),
            ]);
    }
}
