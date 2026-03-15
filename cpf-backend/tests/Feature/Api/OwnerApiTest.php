<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use App\Modules\Investing\Domain\Models\InvestorAllocation;
use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Origination\Domain\Models\OwnerOnboarding;
use App\Modules\Origination\Services\OwnerAccountProvisioner;
use App\Modules\Payments\Contracts\PayoutGateway;
use App\Modules\Payments\Domain\Models\Distribution;
use App\Modules\Payments\Domain\Models\DistributionLine;
use App\Modules\Payments\Domain\Models\InvestorPayoutProfile;
use App\Modules\Payments\Domain\Models\PayoutInstruction;
use App\Modules\Payments\Services\YooKassaPayoutGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OwnerApiTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_project_owner_can_manage_owned_projects_documents_and_reports(): void
    {
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();

        Sanctum::actingAs($owner);

        $this->getJson('/api/v1/owner/projects')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $created = $this->postJson('/api/v1/owner/projects', [
            'slug' => 'retail-south',
            'title' => 'Retail South',
            'excerpt' => 'Готовый объект у транспортного узла.',
            'description' => 'Проект для привлечения капитала под выкуп и повышение доходности.',
            'thesis' => 'Устойчивая аренда и понятный план выхода.',
            'risk_summary' => 'Риск ротации арендаторов.',
            'location' => 'Краснодар',
            'asset_type' => 'commercial_real_estate',
            'risk_level' => 'moderate',
            'payout_frequency' => 'monthly',
            'min_investment' => 20000,
            'target_amount' => 12000000,
            'target_yield' => 17.4,
            'term_months' => 18,
            'cover_image_url' => 'https://example.com/retail-south.jpg',
        ]);

        $created
            ->assertCreated()
            ->assertJsonPath('data.status', 'draft');

        $projectSlug = $created->json('data.slug');

        $this->patchJson("/api/v1/owner/projects/{$projectSlug}", [
            'hero_metric' => '17.4% годовых',
            'title' => 'Retail South Updated',
        ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Retail South Updated');

        $this->postJson("/api/v1/owner/projects/{$projectSlug}/documents", [
            'title' => 'Финансовая модель',
            'kind' => 'financial-model',
            'label' => 'XLSX',
            'file_url' => 'https://example.com/financial-model.xlsx',
            'is_public' => false,
        ])
            ->assertCreated()
            ->assertJsonPath('data.kind', 'financial-model');

        $this->postJson("/api/v1/owner/projects/{$projectSlug}/reports", [
            'title' => 'Стартовый отчет',
            'summary' => 'Подготовлен пакет материалов для модерации.',
            'file_url' => 'https://example.com/report.pdf',
            'report_date' => now()->toDateString(),
            'is_public' => false,
        ])
            ->assertCreated()
            ->assertJsonPath('data.title', 'Стартовый отчет');

        $this->postJson("/api/v1/owner/projects/{$projectSlug}/submit-review")
            ->assertOk()
            ->assertJsonPath('data.status', 'pending_review');

        $project = Project::query()->where('slug', $projectSlug)->firstOrFail();

        $this->getJson("/api/v1/owner/projects/{$projectSlug}/documents")
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson("/api/v1/owner/projects/{$projectSlug}/reports")
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson("/api/v1/owner/projects/{$projectSlug}/investments")
            ->assertOk()
            ->assertJsonPath('data.applicationsCount', 0);

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'status' => 'pending_review',
        ]);
    }

    public function test_project_owner_can_complete_owner_workspace_foundation_and_submit_kyb(): void
    {
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();

        Sanctum::actingAs($owner);

        $workspace = $this->getJson('/api/v1/owner/workspace')
            ->assertOk()
            ->assertJsonPath('data.onboarding.status', 'account_created')
            ->assertJsonPath('data.summary.projectsCount', 2);

        $accountId = $workspace->json('data.account.id');

        $this->patchJson('/api/v1/owner/account', [
            'display_name' => 'North Capital Desk',
            'slug' => 'north-capital-desk',
            'overview' => 'Ведем объекты коммерческой недвижимости и структурируем owner-side поток.',
            'website_url' => 'https://north-capital.example',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'kyb_in_progress');

        $this->patchJson('/api/v1/owner/organization', [
            'legal_name' => 'ООО Норт Кэпитал',
            'brand_name' => 'North Capital',
            'entity_type' => 'ooo',
            'registration_number' => '1234567890123',
            'tax_id' => '7701123456',
            'website_url' => 'https://north-capital.example',
            'address' => 'Москва, Пресненская наб., 8',
            'signatory_name' => 'Алексей Власов',
            'signatory_role' => 'Генеральный директор',
            'beneficiary_name' => 'Алексей Власов',
            'overview' => 'SPV и проекты под частное размещение.',
        ])
            ->assertOk()
            ->assertJsonPath('data.legalName', 'ООО Норт Кэпитал');

        $this->patchJson('/api/v1/owner/bank-profile', [
            'payout_method' => 'bank_transfer',
            'recipient_name' => 'ООО Норт Кэпитал',
            'bank_name' => 'АО Банк Развития',
            'bank_bik' => '044525225',
            'bank_account' => '40702810900000000001',
            'correspondent_account' => '30101810400000000225',
            'notes' => 'Основной расчетный счет для owner-side settlements.',
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'ready_for_review');

        $this->postJson('/api/v1/owner/onboarding/submit')
            ->assertOk()
            ->assertJsonPath('data.onboarding.status', 'kyb_under_review')
            ->assertJsonPath('data.onboarding.canSubmitForReview', true)
            ->assertJsonPath('data.account.displayName', 'North Capital Desk');

        $this->assertDatabaseHas('owner_accounts', [
            'id' => $accountId,
            'slug' => 'north-capital-desk',
            'status' => 'kyb_under_review',
        ]);

        $this->assertDatabaseHas('owner_organizations', [
            'owner_account_id' => $accountId,
            'legal_name' => 'ООО Норт Кэпитал',
        ]);

        $this->assertDatabaseHas('owner_bank_profiles', [
            'owner_account_id' => $accountId,
            'bank_bik' => '044525225',
        ]);

        $this->assertDatabaseHas('owner_onboardings', [
            'owner_account_id' => $accountId,
            'status' => 'kyb_under_review',
        ]);
    }

    public function test_project_owner_can_manage_rounds_for_owned_project(): void
    {
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();
        $project = Project::query()->where('slug', 'galleria-moscow')->firstOrFail();
        $this->approveOwnerFinancialAccess($owner);

        Sanctum::actingAs($owner);

        $this->getJson('/api/v1/owner/rounds')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $created = $this->postJson('/api/v1/owner/rounds', [
            'project_id' => $project->id,
            'slug' => 'galleria-moscow-bridge-round',
            'title' => 'Bridge Round',
            'target_amount' => 9000000,
            'min_investment' => 25000,
            'target_yield' => 16.8,
            'payout_frequency' => 'monthly',
            'term_months' => 12,
            'oversubscription_allowed' => false,
            'opens_at' => now()->addDay()->toAtomString(),
            'closes_at' => now()->addDays(10)->toAtomString(),
            'notes' => 'Тестовый bridge round для owner workspace.',
        ]);

        $created
            ->assertCreated()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.slug', 'galleria-moscow-bridge-round');

        $roundSlug = $created->json('data.slug');

        $this->patchJson("/api/v1/owner/rounds/{$roundSlug}", [
            'title' => 'Bridge Round Updated',
            'target_amount' => 9500000,
        ])
            ->assertOk()
            ->assertJsonPath('data.title', 'Bridge Round Updated')
            ->assertJsonPath('data.targetAmount', 9500000);

        $this->postJson("/api/v1/owner/rounds/{$roundSlug}/submit-review")
            ->assertOk()
            ->assertJsonPath('data.status', 'pending_review');

        $this->postJson("/api/v1/owner/rounds/{$roundSlug}/go-live")
            ->assertOk()
            ->assertJsonPath('data.status', 'live');

        $this->getJson("/api/v1/owner/rounds/{$roundSlug}")
            ->assertOk()
            ->assertJsonPath('data.round.slug', $roundSlug)
            ->assertJsonPath('data.project.slug', 'galleria-moscow')
            ->assertJsonPath('data.metrics.allocationCount', 0);

        $this->postJson("/api/v1/owner/rounds/{$roundSlug}/close")
            ->assertOk()
            ->assertJsonPath('data.status', 'closed');

        $this->assertDatabaseHas('offering_rounds', [
            'slug' => $roundSlug,
            'status' => 'closed',
        ]);
    }

    public function test_project_owner_can_prepare_distribution_and_payout_queue_for_confirmed_allocations(): void
    {
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $round = OfferingRound::query()->where('slug', 'galleria-moscow-main-round')->firstOrFail();
        $this->approveOwnerFinancialAccess($owner);
        $application = InvestmentApplication::query()
            ->where('user_id', $investor->id)
            ->where('offering_round_id', $round->id)
            ->firstOrFail();

        InvestorAllocation::query()->updateOrCreate(
            ['investment_application_id' => $application->id],
            [
                'offering_round_id' => $round->id,
                'project_id' => $application->project_id,
                'user_id' => $investor->id,
                'amount' => $application->amount,
                'status' => 'confirmed',
                'agreement_url' => $application->agreement_url,
                'allocated_at' => now()->subDay(),
            ],
        );

        Sanctum::actingAs($owner);

        $created = $this->postJson("/api/v1/owner/rounds/{$round->slug}/distributions", [
            'title' => 'Мартовская выплата',
            'period_label' => 'Март 2026',
            'period_start' => '2026-03-01',
            'period_end' => '2026-03-31',
            'total_amount' => 24000,
            'payout_mode' => 'manual',
            'notes' => 'Первый реестр выплат по раунду.',
        ]);

        $created
            ->assertCreated()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.linesCount', 1)
            ->assertJsonPath('data.lines.0.amount', 24000);

        $distributionId = $created->json('data.id');

        $this->postJson("/api/v1/owner/distributions/{$distributionId}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', 'approved_for_payout')
            ->assertJsonPath('data.lines.0.status', 'ready');

        $this->postJson("/api/v1/owner/distributions/{$distributionId}/run-payouts")
            ->assertOk()
            ->assertJsonPath('data.status', 'approved_for_payout')
            ->assertJsonPath('data.lines.0.status', 'pending_payout')
            ->assertJsonPath('data.lines.0.payoutInstruction.status', 'manual_required');

        $this->getJson("/api/v1/owner/rounds/{$round->slug}/distributions")
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/v1/owner/payouts')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'manual_required');

        $distribution = Distribution::query()->findOrFail($distributionId);

        $this->assertDatabaseHas('distributions', [
            'id' => $distribution->id,
            'status' => 'approved_for_payout',
        ]);

        $this->assertDatabaseHas('distribution_lines', [
            'distribution_id' => $distribution->id,
            'status' => 'pending_payout',
        ]);

        $this->assertDatabaseHas('payout_instructions', [
            'distribution_id' => $distribution->id,
            'status' => 'manual_required',
            'gateway' => 'manual',
        ]);
    }

    public function test_project_owner_cannot_access_round_of_another_owner(): void
    {
        $anotherOwner = User::factory()->create([
            'email' => 'other-owner@cpf.local',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $anotherOwner->assignRole('project_owner');
        $this->approveOwnerFinancialAccess($anotherOwner);

        $round = OfferingRound::query()->where('slug', 'galleria-moscow-main-round')->firstOrFail();

        Sanctum::actingAs($anotherOwner);

        $this->getJson("/api/v1/owner/rounds/{$round->slug}")
            ->assertNotFound();

        $this->postJson("/api/v1/owner/rounds/{$round->slug}/distributions", [
            'title' => 'Чужое распределение',
            'period_label' => 'Март 2026',
            'total_amount' => 10000,
            'payout_mode' => 'manual',
        ])
            ->assertNotFound();
    }

    public function test_project_owner_cannot_create_distribution_without_confirmed_allocations(): void
    {
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();
        $project = Project::query()->where('slug', 'galleria-moscow')->firstOrFail();
        $this->approveOwnerFinancialAccess($owner);

        Sanctum::actingAs($owner);

        $created = $this->postJson('/api/v1/owner/rounds', [
            'project_id' => $project->id,
            'slug' => 'galleria-empty-distribution-round',
            'title' => 'Empty Distribution Round',
            'target_amount' => 5000000,
            'min_investment' => 25000,
            'target_yield' => 15.5,
            'payout_frequency' => 'monthly',
            'term_months' => 12,
            'oversubscription_allowed' => false,
        ])->assertCreated();

        $roundSlug = $created->json('data.slug');

        $this->postJson("/api/v1/owner/rounds/{$roundSlug}/distributions", [
            'title' => 'Пустой реестр',
            'period_label' => 'Март 2026',
            'total_amount' => 15000,
            'payout_mode' => 'manual',
        ])
            ->assertUnprocessable()
            ->assertJsonPath('code', 'validation_error')
            ->assertJsonPath('details.round.0', 'Нельзя сформировать распределение без подтвержденных аллокаций.');
    }

    public function test_repeated_payout_run_does_not_create_duplicate_payout_instructions(): void
    {
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $round = OfferingRound::query()->where('slug', 'galleria-moscow-main-round')->firstOrFail();
        $this->approveOwnerFinancialAccess($owner);
        $application = InvestmentApplication::query()
            ->where('user_id', $investor->id)
            ->where('offering_round_id', $round->id)
            ->firstOrFail();

        InvestorAllocation::query()->updateOrCreate(
            ['investment_application_id' => $application->id],
            [
                'offering_round_id' => $round->id,
                'project_id' => $application->project_id,
                'user_id' => $investor->id,
                'amount' => $application->amount,
                'status' => 'confirmed',
                'agreement_url' => $application->agreement_url,
                'allocated_at' => now()->subDay(),
            ],
        );

        Sanctum::actingAs($owner);

        $distributionId = $this->postJson("/api/v1/owner/rounds/{$round->slug}/distributions", [
            'title' => 'Идемпотентный payout run',
            'period_label' => 'Апрель 2026',
            'total_amount' => 18000,
            'payout_mode' => 'manual',
        ])
            ->assertCreated()
            ->json('data.id');

        $this->postJson("/api/v1/owner/distributions/{$distributionId}/approve")
            ->assertOk();

        $this->postJson("/api/v1/owner/distributions/{$distributionId}/run-payouts")
            ->assertOk();

        $this->postJson("/api/v1/owner/distributions/{$distributionId}/run-payouts")
            ->assertOk();

        $this->assertDatabaseCount('payout_instructions', 1);
    }

    public function test_project_owner_can_complete_yookassa_payout_when_token_and_gateway_are_available(): void
    {
        config()->set('payments.yookassa.payouts_enabled', true);

        $this->app->instance(PayoutGateway::class, new class extends YooKassaPayoutGateway implements PayoutGateway
        {
            public function createInvestorPayout(PayoutInstruction $instruction, array $payload): array
            {
                return [
                    'id' => 'payout-demo-1',
                    'status' => 'succeeded',
                    'payout_token' => $payload['payout_token'] ?? null,
                    'amount' => [
                        'value' => $instruction->amount,
                        'currency' => $instruction->currency,
                    ],
                ];
            }
        });

        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $round = OfferingRound::query()->where('slug', 'galleria-moscow-main-round')->firstOrFail();
        $this->approveOwnerFinancialAccess($owner);
        $application = InvestmentApplication::query()
            ->where('user_id', $investor->id)
            ->where('offering_round_id', $round->id)
            ->firstOrFail();

        $allocation = InvestorAllocation::query()->updateOrCreate(
            ['investment_application_id' => $application->id],
            [
                'offering_round_id' => $round->id,
                'project_id' => $application->project_id,
                'user_id' => $investor->id,
                'amount' => $application->amount,
                'status' => 'confirmed',
                'agreement_url' => $application->agreement_url,
                'allocated_at' => now()->subDay(),
            ],
        );

        InvestorPayoutProfile::query()->updateOrCreate(
            ['user_id' => $investor->id],
            [
                'provider' => 'yookassa',
                'status' => 'ready',
                'payout_method_label' => 'Основная карта',
                'payout_token' => 'test-payout-token',
                'last_verified_at' => now(),
            ],
        );

        Sanctum::actingAs($owner);

        $distributionId = $this->postJson("/api/v1/owner/rounds/{$round->slug}/distributions", [
            'title' => 'Автовыплата через YooKassa',
            'period_label' => 'Май 2026',
            'total_amount' => 12500,
            'payout_mode' => 'yookassa',
        ])
            ->assertCreated()
            ->json('data.id');

        $distribution = Distribution::query()->findOrFail($distributionId);
        $line = DistributionLine::query()
            ->where('distribution_id', $distribution->id)
            ->where('investor_allocation_id', $allocation->id)
            ->firstOrFail();

        $this->postJson("/api/v1/owner/distributions/{$distribution->id}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', 'approved_for_payout');

        $this->postJson("/api/v1/owner/distributions/{$distribution->id}/run-payouts")
            ->assertOk()
            ->assertJsonPath('data.status', 'paid')
            ->assertJsonPath('data.lines.0.status', 'paid')
            ->assertJsonPath('data.lines.0.payoutInstruction.status', 'succeeded')
            ->assertJsonPath('data.lines.0.payoutInstruction.externalId', 'payout-demo-1');

        $instruction = PayoutInstruction::query()
            ->where('distribution_id', $distribution->id)
            ->where('user_id', $investor->id)
            ->firstOrFail();

        $this->assertDatabaseHas('payout_instructions', [
            'id' => $instruction->id,
            'status' => 'succeeded',
            'external_id' => 'payout-demo-1',
        ]);

        $this->assertDatabaseHas('distribution_lines', [
            'id' => $line->id,
            'status' => 'paid',
        ]);

        $this->assertDatabaseHas('distributions', [
            'id' => $distribution->id,
            'status' => 'paid',
        ]);
    }

    public function test_pending_payouts_can_be_reconciled_by_console_command(): void
    {
        config()->set('payments.yookassa.payouts_enabled', true);

        $this->app->instance(PayoutGateway::class, new class extends YooKassaPayoutGateway implements PayoutGateway
        {
            public function createInvestorPayout(PayoutInstruction $instruction, array $payload): array
            {
                return [
                    'id' => 'payout-sync-demo',
                    'status' => 'processing',
                ];
            }

            public function fetchPayoutStatus(string $externalId): array
            {
                return [
                    'id' => $externalId,
                    'status' => 'succeeded',
                ];
            }
        });

        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();
        $investor = User::query()->where('email', 'investor@cpf.local')->firstOrFail();
        $round = OfferingRound::query()->where('slug', 'galleria-moscow-main-round')->firstOrFail();
        $this->approveOwnerFinancialAccess($owner);

        $application = InvestmentApplication::query()
            ->where('user_id', $investor->id)
            ->where('offering_round_id', $round->id)
            ->firstOrFail();

        $allocation = InvestorAllocation::query()->updateOrCreate(
            ['investment_application_id' => $application->id],
            [
                'offering_round_id' => $round->id,
                'project_id' => $application->project_id,
                'user_id' => $investor->id,
                'amount' => $application->amount,
                'status' => 'confirmed',
                'agreement_url' => $application->agreement_url,
                'allocated_at' => now()->subDay(),
            ],
        );

        Sanctum::actingAs($owner);

        $distributionId = $this->postJson("/api/v1/owner/rounds/{$round->slug}/distributions", [
            'title' => 'Командная синхронизация выплат',
            'period_label' => 'Июнь 2026',
            'total_amount' => 9000,
            'payout_mode' => 'manual',
        ])->assertCreated()->json('data.id');

        $distribution = Distribution::query()->findOrFail($distributionId);
        $line = DistributionLine::query()
            ->where('distribution_id', $distribution->id)
            ->where('investor_allocation_id', $allocation->id)
            ->firstOrFail();

        $instruction = PayoutInstruction::query()->create([
            'distribution_id' => $distribution->id,
            'user_id' => $investor->id,
            'amount' => $line->amount,
            'currency' => 'RUB',
            'direction' => 'investor_distribution',
            'gateway' => 'yookassa_payout',
            'status' => 'processing',
            'external_id' => 'payout-sync-demo',
            'reference_label' => 'Синхронизация статуса',
        ]);

        $line->forceFill([
            'status' => 'pending_payout',
            'payout_instruction_id' => $instruction->id,
        ])->save();

        $distribution->forceFill(['status' => 'processing'])->save();

        $this->artisan('payments:sync-payouts --limit=10')
            ->expectsOutput('Synced 1 payout instruction(s).')
            ->assertExitCode(0);

        $this->assertDatabaseHas('payout_instructions', [
            'id' => $instruction->id,
            'status' => 'succeeded',
        ]);

        $this->assertDatabaseHas('distribution_lines', [
            'id' => $line->id,
            'status' => 'paid',
        ]);

        $this->assertDatabaseHas('distributions', [
            'id' => $distribution->id,
            'status' => 'paid',
        ]);
    }

    public function test_project_owner_cannot_launch_round_until_kyb_is_approved(): void
    {
        $owner = User::query()->where('email', 'owner@cpf.local')->firstOrFail();
        $project = Project::query()->where('slug', 'galleria-moscow')->firstOrFail();

        Sanctum::actingAs($owner);

        $roundSlug = $this->postJson('/api/v1/owner/rounds', [
            'project_id' => $project->id,
            'slug' => 'galleria-moscow-kyb-blocked-round',
            'title' => 'KYB Blocked Round',
            'target_amount' => 7500000,
            'min_investment' => 25000,
            'target_yield' => 16.4,
            'payout_frequency' => 'monthly',
            'term_months' => 12,
            'oversubscription_allowed' => false,
        ])->assertCreated()->json('data.slug');

        $this->postJson("/api/v1/owner/rounds/{$roundSlug}/submit-review")
            ->assertOk()
            ->assertJsonPath('data.status', 'pending_review');

        $this->postJson("/api/v1/owner/rounds/{$roundSlug}/go-live")
            ->assertForbidden()
            ->assertJsonPath('code', 'kyb_approval_required');
    }

    private function approveOwnerFinancialAccess(User $owner): void
    {
        app(OwnerAccountProvisioner::class)->ensureForUser($owner);

        $onboarding = OwnerOnboarding::query()
            ->whereHas('ownerAccount.members', fn ($query) => $query->where('user_id', $owner->id))
            ->firstOrFail();

        $onboarding->forceFill([
            'status' => 'active',
            'submitted_at' => now()->subDay(),
            'reviewed_at' => now()->subHours(12),
            'activated_at' => now()->subHours(12),
        ])->save();

        $onboarding->ownerAccount()->update([
            'status' => 'active',
        ]);
    }
}
