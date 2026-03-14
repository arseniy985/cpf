<?php

namespace App\Filament\Resources\LegalDocuments\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class LegalDocumentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('slug')
                    ->required(),
                TextInput::make('title')
                    ->required(),
                Textarea::make('summary')
                    ->rows(4),
                Select::make('document_type')
                    ->options([
                        'agreement' => 'Договор',
                        'risk' => 'Раскрытие рисков',
                        'policy' => 'Политика',
                    ])
                    ->required(),
                TextInput::make('file_url')
                    ->url(),
                Select::make('status')
                    ->options([
                        'draft' => 'Черновик',
                        'published' => 'Опубликован',
                        'archived' => 'Архив',
                    ])
                    ->required(),
                DateTimePicker::make('published_at'),
            ]);
    }
}
