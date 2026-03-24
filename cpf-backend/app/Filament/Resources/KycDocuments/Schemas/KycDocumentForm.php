<?php

namespace App\Filament\Resources\KycDocuments\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class KycDocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('kyc_profile_id')
                ->label('Анкета инвестора')
                ->relationship('kycProfile', 'legal_name')
                ->searchable()
                ->required(),
            Select::make('kind')
                ->label('Тип документа')
                ->options([
                    'passport' => 'Паспорт',
                    'tax_id' => 'ИНН',
                    'address_proof' => 'Подтверждение адреса',
                    'company_docs' => 'Документы компании',
                    'other' => 'Прочее',
                ])
                ->required(),
            Select::make('status')
                ->label('Статус проверки')
                ->options([
                    'pending_review' => 'На проверке',
                    'approved' => 'Одобрен',
                    'rejected' => 'Отклонён',
                ])
                ->required(),
            TextInput::make('original_name')
                ->label('Имя файла')
                ->required(),
            TextInput::make('path')
                ->label('Путь к файлу')
                ->required(),
            Textarea::make('review_comment')
                ->label('Причина отклонения')
                ->rows(4),
        ]);
    }
}
