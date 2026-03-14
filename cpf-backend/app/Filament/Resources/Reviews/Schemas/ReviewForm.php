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
            TextInput::make('author_name')->required(),
            TextInput::make('author_role'),
            TextInput::make('company_name'),
            TextInput::make('rating')->numeric()->minValue(1)->maxValue(5)->required(),
            Textarea::make('body')->rows(4)->required(),
            TextInput::make('sort_order')->numeric()->default(0),
            Toggle::make('is_published'),
        ]);
    }
}
