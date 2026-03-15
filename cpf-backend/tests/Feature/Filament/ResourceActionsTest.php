<?php

namespace Tests\Feature\Filament;

use App\Filament\Resources\KycDocuments\Pages\ManageKycDocuments;
use App\Filament\Resources\KycProfiles\Pages\ManageKycProfiles;
use App\Filament\Resources\ManualDepositRequests\Pages\ManageManualDepositRequests;
use App\Filament\Resources\ProjectDocuments\Pages\ManageProjectDocuments;
use App\Filament\Resources\Projects\Pages\ManageProjects;
use App\Filament\Resources\StaticPages\Pages\ManageStaticPages;
use App\Filament\Resources\WithdrawalRequests\Pages\ManageWithdrawalRequests;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Compliance\Domain\Models\KycDocument;
use App\Modules\Identity\Domain\Models\KycProfile;
use App\Modules\Payments\Domain\Models\ManualDepositRequest;
use App\Modules\Payments\Domain\Models\WithdrawalRequest;
use Filament\Actions\CreateAction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\Concerns\InteractsWithAdminPanel;
use Tests\TestCase;

class ResourceActionsTest extends TestCase
{
    use InteractsWithAdminPanel;
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_admin_can_create_project_from_filament_resource(): void
    {
        $this->actingAsAdmin();

        Livewire::test(ManageProjects::class)
            ->callAction(CreateAction::class, [
                'slug' => 'office-prime',
                'title' => 'БЦ Prime',
                'excerpt' => 'Стабильный офисный актив.',
                'description' => 'Объект с действующими арендаторами и прозрачной отчетностью.',
                'thesis' => 'Ежемесячный денежный поток.',
                'risk_summary' => 'Риск vacancy на горизонте 24 месяцев.',
                'location' => 'Москва',
                'asset_type' => 'commercial_real_estate',
                'status' => 'published',
                'funding_status' => 'collecting',
                'risk_level' => 'moderate',
                'payout_frequency' => 'monthly',
                'min_investment' => 10000,
                'target_amount' => 25000000,
                'current_amount' => 0,
                'target_yield' => 17.5,
                'term_months' => 24,
                'cover_image_url' => 'https://example.com/project.jpg',
                'hero_metric' => '17.5% годовых',
                'is_featured' => true,
                'published_at' => now()->toDateTimeString(),
            ])
            ->assertHasNoFormErrors()
            ->assertNotified();

        $this->assertDatabaseHas('projects', [
            'slug' => 'office-prime',
            'title' => 'БЦ Prime',
        ]);
    }

    public function test_admin_can_create_project_document_from_filament_resource(): void
    {
        $this->actingAsAdmin();

        $project = Project::query()->where('slug', 'galleria-moscow')->firstOrFail();

        Livewire::test(ManageProjectDocuments::class)
            ->callAction(CreateAction::class, [
                'project_id' => $project->id,
                'title' => 'Финансовая модель',
                'kind' => 'financial-model',
                'label' => 'XLSX',
                'file_url' => 'https://example.com/financial-model.xlsx',
                'sort_order' => 3,
                'is_public' => true,
            ])
            ->assertHasNoFormErrors()
            ->assertNotified();

        $this->assertDatabaseHas('project_documents', [
            'project_id' => $project->id,
            'title' => 'Финансовая модель',
        ]);
    }

    public function test_admin_can_create_static_page_from_filament_resource(): void
    {
        $this->actingAsAdmin();

        Livewire::test(ManageStaticPages::class)
            ->callAction(CreateAction::class, [
                'key' => 'tariffs',
                'title' => 'Тарифы и участие',
                'headline' => 'Структура входа в сделки',
                'summary' => 'Короткое описание условий участия.',
                'body' => 'Порог входа, сценарии выплаты и логика сопровождения.',
                'is_published' => true,
            ])
            ->assertHasNoFormErrors()
            ->assertNotified();

        $this->assertDatabaseHas('static_pages', [
            'key' => 'tariffs',
        ]);
    }

    public function test_admin_can_update_kyc_withdrawal_and_manual_deposit_statuses_from_filament_tables(): void
    {
        $this->actingAsAdmin();

        $kycProfile = KycProfile::query()->where('status', 'pending_review')->firstOrFail();
        $withdrawalRequest = WithdrawalRequest::query()->where('status', 'pending_review')->firstOrFail();
        $manualDepositRequest = ManualDepositRequest::query()->where('status', 'under_review')->firstOrFail();

        Livewire::test(ManageKycProfiles::class)
            ->callTableAction('approve', $kycProfile)
            ->assertHasNoTableActionErrors();

        Livewire::test(ManageWithdrawalRequests::class)
            ->callTableAction('mark_paid', $withdrawalRequest, data: [
                'review_note' => 'Платеж проведен бухгалтером.',
            ])
            ->assertHasNoTableActionErrors();

        Livewire::test(ManageManualDepositRequests::class)
            ->callTableAction('credit', $manualDepositRequest, data: [
                'review_note' => 'Входящий перевод подтвержден по выписке.',
            ])
            ->assertHasNoTableActionErrors();

        $kycDocument = KycDocument::query()->firstOrFail();

        Livewire::test(ManageKycDocuments::class)
            ->callTableAction('reject', $kycDocument, data: [
                'review_comment' => 'Нужен более читаемый скан.',
            ])
            ->assertHasNoTableActionErrors();

        $this->assertDatabaseHas('kyc_profiles', [
            'id' => $kycProfile->id,
            'status' => 'approved',
        ]);

        $this->assertDatabaseHas('withdrawal_requests', [
            'id' => $withdrawalRequest->id,
            'status' => 'paid',
        ]);

        $this->assertDatabaseHas('manual_deposit_requests', [
            'id' => $manualDepositRequest->id,
            'status' => 'credited',
        ]);

        $this->assertDatabaseHas('kyc_documents', [
            'id' => $kycDocument->id,
            'status' => 'rejected',
        ]);
    }
}
