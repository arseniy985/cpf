<?php

namespace App\Filament\Resources\ProjectDocuments\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProjectDocumentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('project.title')
                    ->label('Проект')
                    ->searchable(),
                TextColumn::make('title')
                    ->searchable(),
                TextColumn::make('kind')
                    ->badge(),
                TextColumn::make('label')
                    ->badge(),
                IconColumn::make('is_public')
                    ->boolean(),
                TextColumn::make('sort_order')
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
