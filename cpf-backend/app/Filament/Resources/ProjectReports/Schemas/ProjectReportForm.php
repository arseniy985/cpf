<?php

namespace App\Filament\Resources\ProjectReports\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProjectReportForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('project_id')->relationship('project', 'title')->searchable()->required(),
            TextInput::make('title')->required(),
            Textarea::make('summary')->rows(4),
            TextInput::make('file_url')->url(),
            DatePicker::make('report_date')->required(),
            Toggle::make('is_public'),
        ]);
    }
}
