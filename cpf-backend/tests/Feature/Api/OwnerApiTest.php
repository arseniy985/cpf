<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Modules\Catalog\Domain\Models\Project;
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
}
