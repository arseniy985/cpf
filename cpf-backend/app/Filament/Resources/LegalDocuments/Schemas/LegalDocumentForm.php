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
                    ->label('Slug')
                    ->required(),
                TextInput::make('title')
                    ->label('Заголовок')
                    ->required(),
                Textarea::make('summary')
                    ->label('Краткое описание')
                    ->rows(4),
                Select::make('document_type')
                    ->label('Тип документа')
                    ->options([
                        'agreement' => 'Договор',
                        'risk' => 'Раскрытие рисков',
                        'policy' => 'Политика',
                    ])
                    ->required(),
                TextInput::make('file_url')
                    ->label('Ссылка на файл')
                    ->url(),
                Select::make('status')
                    ->label('Статус')
                    ->options([
                        'draft' => 'Черновик',
                        'published' => 'Опубликован',
                        'archived' => 'Архив',
                    ])
                    ->required(),
                DateTimePicker::make('published_at')->label('Дата публикации'),
            ]);
    }
}
