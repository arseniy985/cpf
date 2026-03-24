<?php

namespace App\Filament\Resources\KycProfiles\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class KycProfileForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('legal_name')
                ->label('ФИО по документам')
                ->required(),
            Select::make('user_id')
                ->label('Пользователь')
                ->relationship('user', 'email')
                ->searchable()
                ->required(),
            Select::make('status')
                ->label('Статус проверки')
                ->options([
                    'draft' => 'Черновик',
                    'pending_review' => 'На проверке',
                    'approved' => 'Одобрена',
                    'rejected' => 'Отклонена',
                ])
                ->required(),
            DatePicker::make('birth_date')
                ->label('Дата рождения'),
            TextInput::make('tax_id')
                ->label('ИНН'),
            TextInput::make('document_number')
                ->label('Номер документа'),
            TextInput::make('address')
                ->label('Адрес'),
            Textarea::make('notes')
                ->label('Комментарий менеджера')
                ->rows(4),
        ]);
    }
}
