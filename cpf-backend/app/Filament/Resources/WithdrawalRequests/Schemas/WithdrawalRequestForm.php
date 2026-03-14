<?php

namespace App\Filament\Resources\WithdrawalRequests\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class WithdrawalRequestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('user_id')->relationship('user', 'email')->searchable()->required(),
            TextInput::make('amount')->numeric()->required(),
            Select::make('status')->options([
                'pending_review' => 'На проверке',
                'approved' => 'Одобрено',
                'rejected' => 'Отклонено',
                'processing_manual_payout' => 'Ручная выплата',
                'paid' => 'Выплачено',
                'failed' => 'Ошибка',
                'cancelled' => 'Отменено',
            ])->required(),
            TextInput::make('bank_name')->required(),
            TextInput::make('bank_account')->required(),
            Textarea::make('comment')->rows(3),
            Textarea::make('review_note')->rows(3),
        ]);
    }
}
