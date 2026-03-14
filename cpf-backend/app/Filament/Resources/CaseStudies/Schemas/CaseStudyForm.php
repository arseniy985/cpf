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
            TextInput::make('slug')->required(),
            TextInput::make('title')->required(),
            Textarea::make('excerpt')->rows(3)->required(),
            Textarea::make('body')->rows(10)->required(),
            TextInput::make('result_metric'),
            Toggle::make('is_published'),
            DateTimePicker::make('published_at'),
        ]);
    }
}
