<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Modules\Identity\Notifications\EmailCodeNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Notification;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_investor_can_register_and_verify_email_code_to_receive_token(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'API Investor',
            'email' => 'api-investor@example.com',
            'phone' => '+7 999 123 45 67',
            'password' => 'password',
            'password_confirmation' => 'password',
            'device_name' => 'phpunit',
        ]);

        $response
            ->assertCreated()
            ->assertJson(fn (AssertableJson $json) => $json
                ->where('data.email', 'api-investor@example.com')
                ->where('data.purpose', 'verify_email')
                ->etc());

        $user = User::query()->where('email', 'api-investor@example.com')->firstOrFail();

        Notification::assertSentTo($user, EmailCodeNotification::class);

        $this->postJson('/api/v1/auth/verify-email-code', [
            'email' => 'api-investor@example.com',
            'code' => '123456',
            'purpose' => 'verify_email',
            'device_name' => 'phpunit',
        ])
            ->assertOk()
            ->assertJsonPath('data.user.email', 'api-investor@example.com')
            ->assertJsonPath('data.user.roles.0', 'investor');

        $this->assertDatabaseHas('users', [
            'email' => 'api-investor@example.com',
        ]);
    }

    public function test_investor_can_login_via_email_code_fetch_profile_and_logout(): void
    {
        Notification::fake();

        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'investor@cpf.local',
            'password' => 'password',
            'device_name' => 'phpunit',
        ]);

        $loginResponse
            ->assertOk()
            ->assertJsonPath('data.email', 'investor@cpf.local')
            ->assertJsonPath('data.purpose', 'login');

        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();

        Notification::assertSentTo($investor, EmailCodeNotification::class);

        $verifyResponse = $this->postJson('/api/v1/auth/verify-email-code', [
            'email' => 'investor@cpf.local',
            'code' => '123456',
            'purpose' => 'login',
            'device_name' => 'phpunit',
        ]);

        $token = $verifyResponse->json('data.token');

        $verifyResponse
            ->assertOk()
            ->assertJsonPath('data.user.email', 'investor@cpf.local');

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'investor@cpf.local');

        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk()
            ->assertJsonPath('data.loggedOut', true);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        $this->postJson('/api/v1/auth/login', [
            'email' => 'investor@cpf.local',
            'password' => 'wrong-password',
        ])
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Неверные учетные данные.');
    }

    public function test_user_can_request_and_use_password_reset_code(): void
    {
        Notification::fake();

        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();

        $this->postJson('/api/v1/auth/password/forgot', [
            'email' => 'investor@cpf.local',
        ])
            ->assertOk()
            ->assertJsonPath('data.purpose', 'password_reset');

        Notification::assertSentTo($investor, EmailCodeNotification::class);

        $this->postJson('/api/v1/auth/password/reset', [
            'email' => 'investor@cpf.local',
            'code' => '123456',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
            ->assertOk()
            ->assertJsonPath('data.passwordReset', true);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'investor@cpf.local',
            'password' => 'new-password',
        ])
            ->assertOk()
            ->assertJsonPath('data.purpose', 'login');
    }

    public function test_investor_can_register_without_email_code_when_feature_flag_is_disabled(): void
    {
        Notification::fake();
        Config::set('cpf.auth.register_with_email_code', false);

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Direct Investor',
            'email' => 'direct-investor@example.com',
            'phone' => '+7 999 321 45 67',
            'password' => 'password',
            'password_confirmation' => 'password',
            'device_name' => 'phpunit',
        ]);

        $token = $response->json('data.token');

        $response
            ->assertCreated()
            ->assertJsonPath('data.user.email', 'direct-investor@example.com')
            ->assertJsonPath('data.user.roles.0', 'investor');

        Notification::assertNothingSent();

        $this->assertDatabaseHas('users', [
            'email' => 'direct-investor@example.com',
        ]);

        $this->assertNotEmpty($token);

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'direct-investor@example.com');
    }

    public function test_investor_can_login_without_email_code_when_feature_flag_is_disabled(): void
    {
        Notification::fake();
        Config::set('cpf.auth.login_with_email_code', false);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'investor@cpf.local',
            'password' => 'password',
            'device_name' => 'phpunit',
        ]);

        $token = $response->json('data.token');

        $response
            ->assertOk()
            ->assertJsonPath('data.user.email', 'investor@cpf.local')
            ->assertJsonPath('data.user.roles.0', 'investor');

        Notification::assertNothingSent();

        $this->assertNotEmpty($token);

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'investor@cpf.local');
    }
}
