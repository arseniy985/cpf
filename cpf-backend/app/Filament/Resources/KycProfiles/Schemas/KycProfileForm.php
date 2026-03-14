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
            TextInput::make('legal_name')->required(),
            Select::make('user_id')->relationship('user', 'email')->searchable()->required(),
            Select::make('status')->options([
                'draft' => 'Черновик',
                'pending_review' => 'На проверке',
                'approved' => 'Одобрен',
                'rejected' => 'Отклонен',
            ])->required(),
            DatePicker::make('birth_date'),
            TextInput::make('tax_id'),
            TextInput::make('document_number'),
            TextInput::make('address'),
            Textarea::make('notes')->rows(4),
        ]);
    }
}
