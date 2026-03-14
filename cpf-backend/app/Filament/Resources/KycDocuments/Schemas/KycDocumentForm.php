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
            Select::make('kyc_profile_id')->relationship('kycProfile', 'legal_name')->searchable()->required(),
            Select::make('kind')->options([
                'passport' => 'Паспорт',
                'tax_id' => 'ИНН',
                'address_proof' => 'Подтверждение адреса',
                'company_docs' => 'Документы компании',
                'other' => 'Прочее',
            ])->required(),
            Select::make('status')->options([
                'pending_review' => 'На проверке',
                'approved' => 'Одобрено',
                'rejected' => 'Отклонено',
            ])->required(),
            TextInput::make('original_name')->required(),
            TextInput::make('path')->required(),
            Textarea::make('review_comment')->rows(4),
        ]);
    }
}
