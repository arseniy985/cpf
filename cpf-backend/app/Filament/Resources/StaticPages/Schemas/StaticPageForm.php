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
            TextInput::make('key')->required(),
            TextInput::make('title')->required(),
            TextInput::make('headline'),
            Textarea::make('summary')->rows(3),
            Textarea::make('body')->rows(10),
            Toggle::make('is_published'),
        ]);
    }
}
