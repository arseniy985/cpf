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
                    ->required(),
                TextInput::make('question')
                    ->required()
                    ->maxLength(255),
                Textarea::make('answer')
                    ->required()
                    ->rows(5),
                TextInput::make('sort_order')
                    ->numeric()
                    ->required(),
                Toggle::make('is_published')
                    ->required(),
            ]);
    }
}
