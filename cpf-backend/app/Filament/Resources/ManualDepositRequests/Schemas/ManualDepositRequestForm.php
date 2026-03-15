<?php

namespace App\Filament\Resources\ManualDepositRequests\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ManualDepositRequestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('user_id')->relationship('user', 'email')->searchable()->required(),
            TextInput::make('amount')->numeric()->required(),
            Select::make('status')->options([
                'awaiting_transfer' => 'Ожидает перевода',
                'under_review' => 'На проверке',
                'awaiting_user_clarification' => 'Нужно уточнение',
                'approved' => 'Подтверждено',
                'credited' => 'Зачислено',
                'rejected' => 'Отклонено',
                'cancelled' => 'Отменено',
                'expired' => 'Истекло',
            ])->required(),
            TextInput::make('reference_code')->disabled()->dehydrated(false),
            TextInput::make('payer_name')->required(),
            TextInput::make('payer_bank'),
            TextInput::make('payer_account_last4'),
            TextInput::make('recipient_name')->disabled()->dehydrated(false),
            TextInput::make('bank_name')->disabled()->dehydrated(false),
            TextInput::make('bank_account')->disabled()->dehydrated(false),
            TextInput::make('manager_email')->disabled()->dehydrated(false),
            Textarea::make('comment')->rows(3),
            Textarea::make('review_note')->rows(4),
        ]);
    }
}
