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

    public function test_guest_proxy_https_request_keeps_secure_admin_login_redirect(): void
    {
        $this->withServerVariables([
            'HTTP_X_FORWARDED_PROTO' => 'https',
            'HTTP_X_FORWARDED_HOST' => 'cpf.elifsyndicate.online',
            'HTTP_X_FORWARDED_PORT' => '443',
            'HTTP_HOST' => 'cpf.elifsyndicate.online',
            'REMOTE_ADDR' => '10.0.0.1',
        ])
            ->get('/admin')
            ->assertRedirect('https://cpf.elifsyndicate.online/admin/login');
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
