<?php

namespace App\Filament\Resources\Projects\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class ProjectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Проект')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('location')
                    ->label('Локация')
                    ->searchable(),
                TextColumn::make('funding_status')
                    ->label('Статус сбора')
                    ->badge(),
                TextColumn::make('target_yield')
                    ->label('Доходность')
                    ->suffix('%')
                    ->sortable(),
                TextColumn::make('current_amount')
                    ->numeric()
                    ->label('Собрано')
                    ->sortable(),
                IconColumn::make('is_featured')
                    ->label('В подборке')
                    ->boolean(),
                TextColumn::make('published_at')
                    ->label('Дата публикации')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
