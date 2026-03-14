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
                    ->relationship('project', 'title')
                    ->searchable()
                    ->preload()
                    ->required(),
                TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                TextInput::make('kind')
                    ->required()
                    ->maxLength(120),
                TextInput::make('label')
                    ->maxLength(80),
                TextInput::make('file_url')
                    ->url()
                    ->required(),
                TextInput::make('sort_order')
                    ->numeric()
                    ->default(0)
                    ->required(),
                Toggle::make('is_public')
                    ->default(true)
                    ->required(),
            ]);
    }
}
