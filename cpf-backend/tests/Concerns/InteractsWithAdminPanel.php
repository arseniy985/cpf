<?php

namespace Tests\Concerns;

use App\Models\User;
use Filament\Facades\Filament;
use Livewire\Livewire;

trait InteractsWithAdminPanel
{
    protected function actingAsAdmin(?User $user = null): User
    {
        $admin = $user ?? User::query()
            ->where('email', 'admin@cpf.local')
            ->firstOrFail();

        Filament::setCurrentPanel(Filament::getPanel('admin'));

        $this->actingAs($admin, 'web');
        Livewire::actingAs($admin, 'web');

        return $admin;
    }
}
