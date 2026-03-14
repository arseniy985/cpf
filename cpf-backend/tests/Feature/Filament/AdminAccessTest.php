<?php

namespace Tests\Feature\Filament;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithAdminPanel;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use InteractsWithAdminPanel;
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_guest_is_redirected_to_admin_login(): void
    {
        $this->get('/admin')
            ->assertRedirect('/admin/login');
    }

    public function test_investor_cannot_access_admin_panel(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();

        $this->actingAs($investor, 'web')
            ->get('/admin')
            ->assertForbidden();
    }

    public function test_admin_can_access_dashboard(): void
    {
        $this->actingAsAdmin();

        $this->get('/admin')
            ->assertOk();

        $this->get('/admin/operations-queue')
            ->assertOk();
    }
}
