<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Engagement\Domain\Models\Notification;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Identity\Domain\Models\KycProfile;
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
                ->where('data.summary.allocationsCount', 0)
                ->where('data.summary.portfolioAmount', 0)
                ->where('data.summary.approvedAmount', 150000)
                ->where('data.summary.pendingAmount', 50000)
                ->has('data.applications', 2)
                ->has('data.allocations', 0)
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
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.round.slug', 'galleria-moscow-main-round');

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

    public function test_investor_can_save_payout_profile_for_automatic_distributions(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        KycProfile::query()->updateOrCreate(
            ['user_id' => $investor->id],
            [
                'legal_name' => $investor->name,
                'birth_date' => now()->subYears(30)->toDateString(),
                'tax_id' => '770111111111',
                'document_number' => '4511999999',
                'address' => 'Москва, ул. Новая, 5',
                'status' => 'approved',
            ],
        );

        Sanctum::actingAs($investor);

        $this->patchJson('/api/v1/me/payout-profile', [
            'provider' => 'yookassa',
            'payout_method_label' => 'Основная карта инвестора',
            'payout_token' => 'secure-payout-token',
        ])
            ->assertOk()
            ->assertJsonPath('data.provider', 'yookassa')
            ->assertJsonPath('data.isReady', true);

        $this->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.investorPayoutProfile.provider', 'yookassa')
            ->assertJsonPath('data.investorPayoutProfile.isReady', true);
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

        $this->withServerVariables([
            'REMOTE_ADDR' => '185.71.76.5',
        ])->postJson('/api/v1/payments/webhooks/yookassa', [
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
        $round = OfferingRound::query()->whereKey($investment->offering_round_id)->firstOrFail();
        $startingAmount = $project->current_amount;
        $startingRoundAmount = $round->current_amount;

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

        $this->assertDatabaseHas('investor_allocations', [
            'investment_application_id' => $investment->id,
            'offering_round_id' => $round->id,
            'amount' => $investment->amount,
            'status' => 'confirmed',
        ]);

        $this->assertDatabaseHas('offering_rounds', [
            'id' => $round->id,
            'current_amount' => $startingRoundAmount + $investment->amount,
        ]);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'current_amount' => $startingAmount + $investment->amount,
        ]);
    }

    public function test_investor_cannot_create_application_when_project_has_no_live_round(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();

        $project = Project::query()->create([
            'owner_id' => $owner->id,
            'owner_account_id' => Project::query()->where('slug', 'galleria-moscow')->value('owner_account_id'),
            'slug' => 'offline-round-project',
            'title' => 'Offline Round Project',
            'excerpt' => 'Тестовый объект без активного раунда.',
            'description' => 'Раунд еще не запущен.',
            'thesis' => 'Сначала round setup, потом investor traffic.',
            'risk_summary' => 'Нет активного окна размещения.',
            'location' => 'Санкт-Петербург',
            'asset_type' => 'commercial_real_estate',
            'status' => 'published',
            'published_at' => now(),
            'funding_status' => 'preparing',
            'risk_level' => 'moderate',
            'payout_frequency' => 'monthly',
            'min_investment' => 15000,
            'target_amount' => 7000000,
            'current_amount' => 0,
            'target_yield' => 15.3,
            'term_months' => 14,
        ]);

        Sanctum::actingAs($investor);

        $this->postJson('/api/v1/investment-applications', [
            'project_id' => $project->id,
            'amount' => 90000,
        ])
            ->assertUnprocessable()
            ->assertJsonPath('code', 'round_not_available');
    }

    public function test_investor_cannot_create_application_below_round_minimum(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $project = Project::query()->where('slug', 'warehouse-a-plus')->firstOrFail();

        Sanctum::actingAs($investor);

        $this->postJson('/api/v1/investment-applications', [
            'project_id' => $project->id,
            'amount' => 10000,
        ])
            ->assertUnprocessable()
            ->assertJsonPath('code', 'validation_error')
            ->assertJsonPath('details.amount.0', 'Сумма ниже минимального чека для выбранного раунда.');
    }

    public function test_investor_cannot_confirm_investment_if_round_limit_is_exceeded(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $investment = $investor->investmentApplications()->where('status', 'approved')->firstOrFail();
        $round = OfferingRound::query()->whereKey($investment->offering_round_id)->firstOrFail();

        $round->forceFill([
            'status' => 'live',
            'current_amount' => $round->target_amount - $investment->amount + 1,
        ])->save();

        Sanctum::actingAs($investor);

        $this->postJson("/api/v1/investments/{$investment->id}/confirm")
            ->assertUnprocessable()
            ->assertJsonPath('code', 'round_limit_exceeded');
    }

    public function test_repeated_confirm_does_not_double_book_wallet_round_or_project_amounts(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $investment = $investor->investmentApplications()->where('status', 'approved')->firstOrFail();
        $project = $investment->project()->firstOrFail();
        $round = OfferingRound::query()->whereKey($investment->offering_round_id)->firstOrFail();

        Sanctum::actingAs($investor);

        $this->postJson("/api/v1/investments/{$investment->id}/confirm")
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed');

        $projectAmountAfterFirstConfirm = $project->fresh()->current_amount;
        $roundAmountAfterFirstConfirm = $round->fresh()->current_amount;
        $walletEntriesAfterFirstConfirm = $investor->walletTransactions()
            ->where('reference_type', InvestmentApplication::class)
            ->where('reference_id', $investment->id)
            ->where('type', 'investment')
            ->count();

        $this->postJson("/api/v1/investments/{$investment->id}/confirm")
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed');

        $this->assertSame($projectAmountAfterFirstConfirm, $project->fresh()->current_amount);
        $this->assertSame($roundAmountAfterFirstConfirm, $round->fresh()->current_amount);
        $this->assertSame(1, $walletEntriesAfterFirstConfirm);
        $this->assertSame(1, $investor->walletTransactions()
            ->where('reference_type', InvestmentApplication::class)
            ->where('reference_id', $investment->id)
            ->where('type', 'investment')
            ->count());
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

    public function test_financial_actions_require_approved_kyc(): void
    {
        $investor = User::factory()->create([
            'email' => 'kyc-pending@cpf.local',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $investor->assignRole('investor');

        KycProfile::query()->create([
            'user_id' => $investor->id,
            'status' => 'pending_review',
            'legal_name' => 'Pending Investor',
        ]);

        $project = Project::query()->where('slug', 'galleria-moscow')->firstOrFail();

        Sanctum::actingAs($investor);

        $this->withHeader('Idempotency-Key', 'kyc-pending-deposit')
            ->postJson('/api/v1/deposits', [
                'amount' => 10000,
            ])
            ->assertForbidden()
            ->assertJsonPath('code', 'kyc_approval_required');

        $this->postJson('/api/v1/investment-applications', [
            'project_id' => $project->id,
            'amount' => 50000,
        ])
            ->assertForbidden()
            ->assertJsonPath('code', 'kyc_approval_required');

        $this->withHeader('Idempotency-Key', 'kyc-pending-withdraw')
            ->postJson('/api/v1/wallet/withdrawals', [
                'amount' => 10000,
                'bank_name' => 'Т-Банк',
                'bank_account' => '40817810000000000003',
            ])
            ->assertForbidden()
            ->assertJsonPath('code', 'kyc_approval_required');
    }

    public function test_public_api_hides_unpublished_project_resources(): void
    {
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();

        $project = Project::query()->create([
            'owner_id' => $owner->id,
            'owner_account_id' => Project::query()->where('slug', 'galleria-moscow')->value('owner_account_id'),
            'slug' => 'hidden-project',
            'title' => 'Hidden Project',
            'excerpt' => 'Черновик',
            'description' => 'Непубличный проект.',
            'thesis' => 'Не должен попадать в public API.',
            'risk_summary' => 'Черновик.',
            'location' => 'Казань',
            'asset_type' => 'commercial_real_estate',
            'status' => 'draft',
            'funding_status' => 'preparing',
            'risk_level' => 'moderate',
            'payout_frequency' => 'monthly',
            'min_investment' => 15000,
            'target_amount' => 7000000,
            'current_amount' => 0,
            'target_yield' => 15.3,
            'term_months' => 14,
        ]);

        OfferingRound::query()->create([
            'project_id' => $project->id,
            'owner_account_id' => $project->owner_account_id,
            'slug' => 'hidden-project-live-round',
            'title' => 'Hidden Project Live Round',
            'status' => 'live',
            'target_amount' => 7000000,
            'current_amount' => 0,
            'min_investment' => 15000,
            'target_yield' => 15.3,
            'payout_frequency' => 'monthly',
            'term_months' => 14,
        ]);

        $this->getJson('/api/v1/projects/hidden-project')->assertNotFound();
        $this->getJson('/api/v1/projects/hidden-project/documents')->assertNotFound();
        $this->getJson('/api/v1/projects/hidden-project/faq')->assertNotFound();
        $this->getJson('/api/v1/projects/hidden-project/payout-forecast')->assertNotFound();
    }

    public function test_investor_cannot_create_application_for_unpublished_project_even_if_round_is_live(): void
    {
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();

        $project = Project::query()->create([
            'owner_id' => $owner->id,
            'owner_account_id' => Project::query()->where('slug', 'galleria-moscow')->value('owner_account_id'),
            'slug' => 'unpublished-live-round-project',
            'title' => 'Unpublished Live Round Project',
            'excerpt' => 'Непубличный live round',
            'description' => 'Раунд не должен принимать инвесторов.',
            'thesis' => 'Проект не опубликован.',
            'risk_summary' => 'Не завершена модерация.',
            'location' => 'Сочи',
            'asset_type' => 'commercial_real_estate',
            'status' => 'pending_review',
            'funding_status' => 'preparing',
            'risk_level' => 'moderate',
            'payout_frequency' => 'monthly',
            'min_investment' => 15000,
            'target_amount' => 7000000,
            'current_amount' => 0,
            'target_yield' => 15.3,
            'term_months' => 14,
        ]);

        OfferingRound::query()->create([
            'project_id' => $project->id,
            'owner_account_id' => $project->owner_account_id,
            'slug' => 'unpublished-live-round',
            'title' => 'Unpublished Live Round',
            'status' => 'live',
            'target_amount' => 7000000,
            'current_amount' => 0,
            'min_investment' => 15000,
            'target_yield' => 15.3,
            'payout_frequency' => 'monthly',
            'term_months' => 14,
        ]);

        Sanctum::actingAs($investor);

        $this->postJson('/api/v1/investment-applications', [
            'project_id' => $project->id,
            'amount' => 90000,
        ])->assertNotFound();
    }

    public function test_financial_idempotency_keys_are_scoped_to_user(): void
    {
        $firstInvestor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $secondInvestor = User::factory()->create([
            'email' => 'second-investor@cpf.local',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $secondInvestor->assignRole('investor');

        KycProfile::query()->create([
            'user_id' => $secondInvestor->id,
            'status' => 'approved',
            'legal_name' => 'Second Investor',
        ]);

        $this->app->bind(PaymentGateway::class, fn () => new FakePaymentGateway);

        Sanctum::actingAs($firstInvestor);
        $this->withHeader('Idempotency-Key', 'shared-financial-key')
            ->postJson('/api/v1/deposits', [
                'amount' => 12000,
            ])
            ->assertCreated();

        Sanctum::actingAs($secondInvestor);
        $this->withHeader('Idempotency-Key', 'shared-financial-key')
            ->postJson('/api/v1/deposits', [
                'amount' => 13000,
            ])
            ->assertCreated()
            ->assertJsonPath('data.amount', 13000);

        $this->assertDatabaseHas('payment_transactions', [
            'user_id' => $firstInvestor->id,
            'idempotency_key' => 'shared-financial-key',
            'amount' => 12000,
        ]);

        $this->assertDatabaseHas('payment_transactions', [
            'user_id' => $secondInvestor->id,
            'idempotency_key' => 'shared-financial-key',
            'amount' => 13000,
        ]);
    }

    public function test_yookassa_webhook_rejects_untrusted_source_ip(): void
    {
        $this->withServerVariables([
            'REMOTE_ADDR' => '127.0.0.1',
        ])->postJson('/api/v1/payments/webhooks/yookassa', [
            'object' => [
                'id' => 'demo-yookassa-payment',
            ],
        ])
            ->assertForbidden()
            ->assertJsonPath('code', 'invalid_webhook_source');
    }
}
