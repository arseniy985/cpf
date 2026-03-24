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
                    ->label('Пользователь')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->required(),
                Select::make('project_id')
                    ->label('Проект')
                    ->relationship('project', 'title')
                    ->searchable()
                    ->required(),
                TextInput::make('amount')
                    ->label('Сумма заявки')
                    ->numeric()
                    ->required(),
                Select::make('status')
                    ->label('Статус заявки')
                    ->options([
                        'pending' => 'Новая',
                        'approved' => 'Одобрена',
                        'rejected' => 'Отклонена',
                    ])
                    ->required(),
                Textarea::make('notes')
                    ->label('Комментарий')
                    ->rows(4),
            ]);
    }
}
