<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Modules\Origination\Domain\Models\OwnerAccount;
use App\Modules\Identity\Notifications\EmailCodeNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Notification;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
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

    public function test_owner_can_register_and_verify_email_code_to_receive_owner_ready_profile(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'API Owner',
            'email' => 'api-owner@example.com',
            'phone' => '+7 999 123 45 68',
            'password' => 'password',
            'password_confirmation' => 'password',
            'device_name' => 'phpunit',
            'account_type' => 'owner',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.email', 'api-owner@example.com')
            ->assertJsonPath('data.purpose', 'verify_email');

        $user = User::query()->where('email', 'api-owner@example.com')->firstOrFail();

        Notification::assertSentTo($user, EmailCodeNotification::class);

        $verifyResponse = $this->postJson('/api/v1/auth/verify-email-code', [
            'email' => 'api-owner@example.com',
            'code' => '123456',
            'purpose' => 'verify_email',
            'device_name' => 'phpunit',
        ])
            ->assertOk()
            ->assertJsonPath('data.user.email', 'api-owner@example.com')
            ->assertJsonPath('data.user.ownerAccount.displayName', 'API Owner');

        $roles = $verifyResponse->json('data.user.roles');

        $this->assertContains('investor', $roles);
        $this->assertContains('project_owner', $roles);

        $this->assertDatabaseHas('owner_accounts', [
            'primary_user_id' => $user->id,
            'display_name' => 'API Owner',
            'status' => 'account_created',
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

    public function test_owner_can_register_without_email_code_when_feature_flag_is_disabled(): void
    {
        Notification::fake();
        Config::set('cpf.auth.register_with_email_code', false);

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Direct Owner',
            'email' => 'direct-owner@example.com',
            'phone' => '+7 999 321 45 68',
            'password' => 'password',
            'password_confirmation' => 'password',
            'device_name' => 'phpunit',
            'account_type' => 'owner',
        ]);

        $token = $response->json('data.token');
        $roles = $response->json('data.user.roles');

        $response
            ->assertCreated()
            ->assertJsonPath('data.user.email', 'direct-owner@example.com')
            ->assertJsonPath('data.user.ownerAccount.displayName', 'Direct Owner');

        $this->assertContains('investor', $roles);
        $this->assertContains('project_owner', $roles);
        Notification::assertNothingSent();

        $owner = User::query()->where('email', 'direct-owner@example.com')->firstOrFail();

        $this->assertDatabaseHas('owner_accounts', [
            'primary_user_id' => $owner->id,
            'display_name' => 'Direct Owner',
        ]);

        $this->assertNotEmpty($token);

        $this->withToken($token)
            ->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.email', 'direct-owner@example.com')
            ->assertJsonPath('data.ownerAccount.displayName', 'Direct Owner');
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

    public function test_authenticated_investor_can_enroll_into_owner_workspace(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();

        Sanctum::actingAs($investor);

        $response = $this->postJson('/api/v1/owner/enroll')
            ->assertOk()
            ->assertJsonPath('data.email', 'investor@cpf.local')
            ->assertJsonPath('data.ownerAccount.displayName', 'Investor Demo');

        $roles = $response->json('data.roles');

        $this->assertContains('investor', $roles);
        $this->assertContains('project_owner', $roles);

        $account = OwnerAccount::query()
            ->where('primary_user_id', $investor->id)
            ->first();

        $this->assertNotNull($account);

        $this->assertDatabaseHas('owner_members', [
            'owner_account_id' => $account?->id,
            'user_id' => $investor->id,
            'role' => 'owner',
        ]);
    }

    public function test_owner_enrollment_is_idempotent_for_existing_owner(): void
    {
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();
        $initialOwnerAccountId = OwnerAccount::query()
            ->where('primary_user_id', $owner->id)
            ->value('id');

        Sanctum::actingAs($owner);

        $response = $this->postJson('/api/v1/owner/enroll')
            ->assertOk()
            ->assertJsonPath('data.ownerAccount.id', $initialOwnerAccountId);

        $roles = $response->json('data.roles');

        $this->assertContains('project_owner', $roles);
        $this->assertDatabaseCount('owner_accounts', 1);
    }

    public function test_email_code_verification_stops_after_max_attempts(): void
    {
        Notification::fake();
        Config::set('cpf.auth.email_code_max_attempts', 2);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'investor@cpf.local',
            'password' => 'password',
            'device_name' => 'phpunit',
        ])->assertOk();

        $this->postJson('/api/v1/auth/verify-email-code', [
            'email' => 'investor@cpf.local',
            'code' => '000000',
            'purpose' => 'login',
            'device_name' => 'phpunit',
        ])->assertUnprocessable();

        $this->postJson('/api/v1/auth/verify-email-code', [
            'email' => 'investor@cpf.local',
            'code' => '000000',
            'purpose' => 'login',
            'device_name' => 'phpunit',
        ])->assertUnprocessable();

        $this->postJson('/api/v1/auth/verify-email-code', [
            'email' => 'investor@cpf.local',
            'code' => '123456',
            'purpose' => 'login',
            'device_name' => 'phpunit',
        ])
            ->assertUnprocessable();
    }

    public function test_auth_routes_are_rate_limited(): void
    {
        Notification::fake();
        Config::set('cpf.auth.throttle.login_per_minute', 2);

        $payload = [
            'email' => 'investor@cpf.local',
            'password' => 'password',
            'device_name' => 'phpunit',
        ];

        $this->postJson('/api/v1/auth/login', $payload)->assertOk();
        $this->postJson('/api/v1/auth/login', $payload)->assertOk();
        $this->postJson('/api/v1/auth/login', $payload)
            ->assertStatus(429)
            ->assertJsonPath('code', 'too_many_requests');
    }
}
