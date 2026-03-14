<?php

namespace App\Filament\Resources\Notifications\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class NotificationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('user_id')->relationship('user', 'email')->searchable()->required(),
            TextInput::make('type')->required(),
            TextInput::make('title')->required(),
            Textarea::make('body')->rows(4)->required(),
            TextInput::make('action_url'),
        ]);
    }
}
