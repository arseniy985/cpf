<?php

namespace App\Filament\Resources\ProjectSubmissions\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ProjectSubmissionForm
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
                TextInput::make('company_name'),
                TextInput::make('project_name')
                    ->required(),
                TextInput::make('asset_type')
                    ->required(),
                TextInput::make('target_amount')
                    ->numeric()
                    ->required(),
                Textarea::make('message')
                    ->rows(4),
                Select::make('status')
                    ->options([
                        'new' => 'Новый',
                        'reviewing' => 'На проверке',
                        'approved' => 'Одобрен',
                        'rejected' => 'Отклонен',
                    ])
                    ->required(),
            ]);
    }
}
