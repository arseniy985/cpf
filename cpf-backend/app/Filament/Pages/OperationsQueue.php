<?php

namespace App\Filament\Pages;

use App\Filament\Support\ManagerWorkspaceData;
use BackedEnum;
use Filament\Pages\Page;
use UnitEnum;

class OperationsQueue extends Page
{
    protected static ?string $title = 'Входящие задачи';

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-list';

    protected static ?string $navigationLabel = 'Входящие задачи';

    protected static string|UnitEnum|null $navigationGroup = 'Рабочий стол';

    protected static ?int $navigationSort = -1;

    protected string $view = 'filament.pages.operations-queue';

    protected ?string $heading = 'Входящие задачи';

    protected ?string $subheading = 'Здесь собраны все очереди, по которым менеджеру нужно принять решение или проверить просрочку.';

    protected function getViewData(): array
    {
        return ManagerWorkspaceData::build();
    }

    public static function getNavigationBadge(): ?string
    {
        $count = ManagerWorkspaceData::pendingTaskCount();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return ManagerWorkspaceData::overdueTaskCount() > 0 ? 'danger' : 'warning';
    }
}
