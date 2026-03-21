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
                ->options([
                    'account_created' => 'Аккаунт создан',
                    'kyb_in_progress' => 'Проверка компании',
                    'kyb_under_review' => 'На проверке',
                    'kyb_approved' => 'Одобрено',
                    'active' => 'Активно',
                    'kyb_rejected' => 'Отклонено',
                ])
                ->required(),
            DateTimePicker::make('submitted_at'),
            DateTimePicker::make('reviewed_at'),
            DateTimePicker::make('activated_at'),
            Textarea::make('rejection_reason')
                ->rows(4),
        ]);
    }
}
