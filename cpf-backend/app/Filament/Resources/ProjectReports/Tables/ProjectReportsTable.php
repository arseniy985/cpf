<?php

namespace App\Filament\Resources\ProjectReports\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProjectReportsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('project.title')->label('Проект')->searchable(),
                TextColumn::make('title')->label('Название отчёта')->searchable(),
                TextColumn::make('report_date')->label('Дата отчёта')->date(),
                IconColumn::make('is_public')->label('Публичный')->boolean(),
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
