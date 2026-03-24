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
            Select::make('user_id')->label('Пользователь')->relationship('user', 'email')->searchable()->required(),
            TextInput::make('amount')->label('Сумма')->numeric()->required(),
            Select::make('status')->label('Статус заявки')->options([
                'pending_review' => 'На проверке',
                'approved' => 'Одобрено',
                'rejected' => 'Отклонено',
                'processing_manual_payout' => 'Ручная выплата',
                'paid' => 'Выплачено',
                'failed' => 'Ошибка',
                'cancelled' => 'Отменено',
            ])->required(),
            TextInput::make('bank_name')->label('Банк')->required(),
            TextInput::make('bank_account')->label('Счёт')->required(),
            Textarea::make('comment')->label('Комментарий пользователя')->rows(3),
            Textarea::make('review_note')->label('Комментарий менеджера')->rows(3),
        ]);
    }
}
