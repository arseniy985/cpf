<?php

namespace App\Filament\Resources\InvestmentApplications\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class InvestmentApplicationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->required(),
                Select::make('project_id')
                    ->relationship('project', 'title')
                    ->searchable()
                    ->required(),
                TextInput::make('amount')
                    ->numeric()
                    ->required(),
                Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ])
                    ->required(),
                Textarea::make('notes')
                    ->rows(4),
            ]);
    }
}
