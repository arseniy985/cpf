<?php

namespace App\Filament\Resources\OwnerOnboardings\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OwnerOnboardingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('status')
                ->label('Статус проверки')
                ->options([
                    'account_created' => 'Аккаунт создан',
                    'kyb_in_progress' => 'Проверка компании',
                    'kyb_under_review' => 'На проверке',
                    'kyb_approved' => 'Одобрено',
                    'active' => 'Активно',
                    'kyb_rejected' => 'Отклонено',
                ])
                ->required(),
            DateTimePicker::make('submitted_at')->label('Отправлена'),
            DateTimePicker::make('reviewed_at')->label('Проверена'),
            DateTimePicker::make('activated_at')->label('Активирована'),
            Textarea::make('rejection_reason')
                ->label('Причина отклонения')
                ->rows(4),
        ]);
    }
}
