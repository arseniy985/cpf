<?php

namespace App\Filament\Resources\ContactLeads\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ContactLeadForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('full_name')
                    ->label('ФИО')
                    ->required(),
                TextInput::make('email')
                    ->label('Email')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->label('Телефон')
                    ->tel(),
                TextInput::make('subject')
                    ->label('Тема')
                    ->required(),
                TextInput::make('source')
                    ->label('Источник'),
                Textarea::make('message')
                    ->label('Сообщение')
                    ->rows(4),
                Select::make('status')
                    ->label('Статус')
                    ->options([
                        'new' => 'Новый',
                        'contacted' => 'Связались',
                        'qualified' => 'Квалифицирован',
                        'archived' => 'Архив',
                    ])
                    ->required(),
            ]);
    }
}
