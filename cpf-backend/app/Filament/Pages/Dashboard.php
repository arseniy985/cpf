<?php

namespace App\Filament\Pages;

use App\Filament\Support\ManagerWorkspaceData;
use BackedEnum;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\Support\Htmlable;
use UnitEnum;

class Dashboard extends BaseDashboard
{
    protected static ?string $title = 'Рабочий стол';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHome;

    protected static string|UnitEnum|null $navigationGroup = 'Рабочий стол';

    protected string $view = 'filament.pages.dashboard';

    protected ?string $heading = 'Рабочий стол менеджера';

    protected ?string $subheading = 'Смотрите сначала на просроченные задачи и очереди, где нужно принять решение сегодня.';

    protected function getViewData(): array
    {
        return ManagerWorkspaceData::build();
    }
}
