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
                    ->required(),
                TextInput::make('email')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->tel(),
                TextInput::make('subject')
                    ->required(),
                TextInput::make('source'),
                Textarea::make('message')
                    ->rows(4),
                Select::make('status')
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
