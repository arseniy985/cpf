<?php

namespace App\Filament\Resources\ProjectFaqItems\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProjectFaqItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('project_id')->relationship('project', 'title')->searchable()->required(),
            TextInput::make('question')->required(),
            Textarea::make('answer')->rows(4)->required(),
            TextInput::make('sort_order')->numeric()->default(0),
            Toggle::make('is_published'),
        ]);
    }
}
