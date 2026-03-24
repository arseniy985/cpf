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
            Select::make('user_id')->label('Пользователь')->relationship('user', 'email')->searchable()->required(),
            TextInput::make('amount')->label('Сумма')->numeric()->required(),
            Select::make('status')->label('Статус заявки')->options([
                'awaiting_transfer' => 'Ожидает перевода',
                'under_review' => 'На проверке',
                'awaiting_user_clarification' => 'Ждёт уточнение от пользователя',
                'approved' => 'Подтверждено',
                'credited' => 'Зачислено',
                'rejected' => 'Отклонено',
                'cancelled' => 'Отменено',
                'expired' => 'Истекло',
            ])->required(),
            TextInput::make('reference_code')->label('Код заявки')->disabled()->dehydrated(false),
            TextInput::make('payer_name')->label('Плательщик')->required(),
            TextInput::make('payer_bank')->label('Банк плательщика'),
            TextInput::make('payer_account_last4')->label('Последние 4 цифры счёта'),
            TextInput::make('recipient_name')->label('Получатель')->disabled()->dehydrated(false),
            TextInput::make('bank_name')->label('Банк получателя')->disabled()->dehydrated(false),
            TextInput::make('bank_account')->label('Счёт получателя')->disabled()->dehydrated(false),
            TextInput::make('manager_email')->label('Ответственный менеджер')->disabled()->dehydrated(false),
            Textarea::make('comment')->label('Комментарий пользователя')->rows(3),
            Textarea::make('review_note')->label('Комментарий менеджера')->rows(4),
        ]);
    }
}
