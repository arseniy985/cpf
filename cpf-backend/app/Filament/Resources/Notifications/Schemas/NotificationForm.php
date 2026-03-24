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
            Select::make('user_id')->label('Пользователь')->relationship('user', 'email')->searchable()->required(),
            TextInput::make('type')->label('Тип уведомления')->required(),
            TextInput::make('title')->label('Заголовок')->required(),
            Textarea::make('body')->label('Текст уведомления')->rows(4)->required(),
            TextInput::make('action_url')->label('Ссылка действия'),
        ]);
    }
}
