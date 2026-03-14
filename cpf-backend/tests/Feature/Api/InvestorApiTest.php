<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Engagement\Domain\Models\Notification;
use App\Modules\Payments\Contracts\PaymentGateway;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use App\Modules\Payments\Domain\Models\WithdrawalRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\Fluent\AssertableJson;
use Laravel\Sanctum\Sanctum;
use Tests\Support\Fakes\FakePaymentGateway;
use Tests\TestCase;

class InvestorApiTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_protected_investor_routes_require_authentication(): void
    {
        $this->getJson('/api/v1/dashboard')
            ->assertUnauthorized();
    }

    public function test_dashboard_returns_summary_applications_and_transactions(): void
    {
        Sanctum::actingAs(User::query()->where('email', 'investor@cpf.local')->firstOrFail());

        $this->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json
                ->where('data.user.email', 'investor@cpf.local')
                ->where('data.summary.applicationsCount', 2)
                ->where('data.summary.portfolioAmount', 200000)
                ->where('data.summary.approvedAmount', 150000)
                ->where('data.summary.pendingAmount', 50000)
                ->has('data.applications', 2)
                ->has('data.transactions', 1)
                ->etc());
    }

    public function test_investor_can_create_investment_application(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $project = Project::query()->where('slug', 'galleria-moscow')->firstOrFail();

        Sanctum::actingAs($investor);

        $response = $this->postJson('/api/v1/investment-applications', [
            'project_id' => $project->id,
            'amount' => 120000,
            'notes' => 'Добавляю позицию.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.amount', 120000)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('investment_applications', [
            'user_id' => $investor->id,
            'project_id' => $project->id,
            'amount' => 120000,
        ]);
    }

    public function test_investor_can_list_only_own_payment_transactions(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $otherUser = User::factory()->create();

        PaymentTransaction::query()->create([
            'user_id' => $otherUser->id,
            'gateway' => 'yookassa',
            'type' => 'deposit',
            'status' => 'pending',
            'amount' => 99000,
            'currency' => 'RUB',
            'external_id' => 'external-other-user',
            'confirmation_url' => 'https://yookassa.test/another',
            'payload' => ['demo' => true],
        ]);

        Sanctum::actingAs($investor);

        $this->getJson('/api/v1/payment-transactions')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.gateway', 'yookassa');
    }

    public function test_deposit_uses_payment_gateway_strategy_and_persists_transaction(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();

        $this->app->bind(PaymentGateway::class, fn () => new FakePaymentGateway);

        Sanctum::actingAs($investor);

        $response = $this->withHeader('Idempotency-Key', 'test-deposit-key')
            ->postJson('/api/v1/deposits', [
                'amount' => 15000,
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.gateway', 'yookassa')
            ->assertJsonPath('data.amount', 15000);

        $this->assertDatabaseHas('payment_transactions', [
            'user_id' => $investor->id,
            'amount' => 15000,
            'gateway' => 'yookassa',
        ]);
    }

    public function test_investor_can_update_profile_and_submit_kyc(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        Sanctum::actingAs($investor);

        $this->patchJson('/api/v1/me', [
            'name' => 'Investor Updated',
            'phone' => '+7 999 333 22 11',
            'notification_preferences' => [
                'email' => true,
                'sms' => true,
                'marketing' => false,
            ],
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Investor Updated');

        $this->postJson('/api/v1/me/kyc', [
            'legal_name' => 'Investor Updated',
            'birth_date' => '1991-04-21',
            'tax_id' => '770111111111',
            'document_number' => '4511 999999',
            'address' => 'Москва, ул. Новая, 5',
        ])
            ->assertCreated()
            ->assertJsonPath('data.status', 'pending_review');

        $this->getJson('/api/v1/me/kyc')
            ->assertOk()
            ->assertJsonPath('data.legalName', 'Investor Updated');
    }

    public function test_investor_can_work_with_notifications_documents_and_withdrawals(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        Sanctum::actingAs($investor);

        $notification = Notification::query()->where('user_id', $investor->id)->firstOrFail();

        $this->getJson('/api/v1/cabinet/notifications')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->patchJson("/api/v1/cabinet/notifications/{$notification->id}/read")
            ->assertOk()
            ->assertJsonPath('data.isRead', true);

        $this->getJson('/api/v1/cabinet/documents')
            ->assertOk()
            ->assertJsonCount(2, 'data.legalDocuments')
            ->assertJsonCount(2, 'data.projectDocuments');

        $this->withHeader('Idempotency-Key', 'withdraw-test-key')
            ->postJson('/api/v1/wallet/withdrawals', [
                'amount' => 10000,
                'bank_name' => 'Т-Банк',
                'bank_account' => '40817810000000000002',
                'comment' => 'Частичный вывод',
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', 'pending_review');

        $withdrawal = WithdrawalRequest::query()->where('idempotency_key', 'withdraw-test-key')->firstOrFail();

        $this->getJson('/api/v1/wallet/withdrawals')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->getJson("/api/v1/wallet/withdrawals/{$withdrawal->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $withdrawal->id);

        $this->postJson("/api/v1/wallet/withdrawals/{$withdrawal->id}/cancel")
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');
    }

    public function test_investor_can_upload_kyc_document_and_payment_webhook_creates_wallet_credit(): void
    {
        Storage::fake('private');

        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        Sanctum::actingAs($investor);

        $this->post('/api/v1/me/kyc/documents', [
            'kind' => 'passport',
            'file' => UploadedFile::fake()->create('passport.pdf', 120, 'application/pdf'),
        ])
            ->assertCreated()
            ->assertJsonPath('data.kind', 'passport');

        $this->getJson('/api/v1/me/kyc/documents')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->app->bind(PaymentGateway::class, fn () => new FakePaymentGateway);

        $depositResponse = $this->withHeader('Idempotency-Key', 'webhook-payment-key')
            ->postJson('/api/v1/deposits', [
                'amount' => 20000,
            ]);

        $externalId = $depositResponse->json('data.externalId');

        $this->postJson('/api/v1/payments/webhooks/yookassa', [
            'object' => [
                'id' => $externalId,
            ],
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'paid');

        $transaction = PaymentTransaction::query()->where('external_id', $externalId)->firstOrFail();

        $this->assertDatabaseHas('wallet_transactions', [
            'user_id' => $investor->id,
            'type' => 'deposit',
            'reference_id' => $transaction->id,
            'status' => 'posted',
        ]);
    }

    public function test_investor_can_fetch_agreement_and_confirm_investment(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $investment = $investor->investmentApplications()->where('status', 'approved')->firstOrFail();
        $project = $investment->project()->firstOrFail();
        $startingAmount = $project->current_amount;

        Sanctum::actingAs($investor);

        $this->getJson("/api/v1/investments/{$investment->id}/agreement")
            ->assertOk()
            ->assertJsonPath('data.investmentId', $investment->id);

        $this->postJson("/api/v1/investments/{$investment->id}/confirm")
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed');

        $this->assertDatabaseHas('investment_applications', [
            'id' => $investment->id,
            'status' => 'confirmed',
        ]);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'current_amount' => $startingAmount + $investment->amount,
        ]);
    }

    public function test_financial_requests_require_idempotency_key(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        Sanctum::actingAs($investor);

        $this->postJson('/api/v1/wallet/withdrawals', [
            'amount' => 10000,
            'bank_name' => 'Т-Банк',
            'bank_account' => '40817810000000000003',
        ])
            ->assertUnprocessable()
            ->assertJsonPath('code', 'idempotency_key_required');
    }
}
