<?php

namespace Tests\Feature\Api;

use App\Modules\Catalog\Domain\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_home_endpoint_returns_featured_projects_and_stats(): void
    {
        $response = $this->getJson('/api/v1/home');

        $response
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json
                ->where('data.stats.projectsCount', 2)
                ->where('data.stats.investorsCount', 1)
                ->where('data.stats.totalInvested', 200000)
                ->has('data.featuredProjects', 2)
                ->etc());
    }

    public function test_faq_and_legal_documents_endpoints_return_published_records(): void
    {
        $this->getJson('/api/v1/faq')
            ->assertOk()
            ->assertJsonCount(3, 'data');

        $this->getJson('/api/v1/legal-documents')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_projects_index_returns_meta_and_only_published_projects(): void
    {
        $response = $this->getJson('/api/v1/projects');

        $response
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json
                ->has('data', 2)
                ->where('meta.total', 2)
                ->where('data.0.status', 'published')
                ->etc());
    }

    public function test_project_show_returns_project_with_public_documents(): void
    {
        $response = $this->getJson('/api/v1/projects/galleria-moscow');

        $response
            ->assertOk()
            ->assertJson(fn (AssertableJson $json) => $json
                ->where('data.slug', 'galleria-moscow')
                ->has('data.documents', 2)
                ->where('data.documents.0.isPublic', true)
                ->etc());
    }

    public function test_public_project_supporting_endpoints_return_faq_documents_and_forecast(): void
    {
        $this->getJson('/api/v1/projects/galleria-moscow/documents')
            ->assertOk()
            ->assertJsonCount(2, 'data');

        $this->getJson('/api/v1/projects/galleria-moscow/faq')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/v1/projects/galleria-moscow/payout-forecast?amount=100000&term_months=12')
            ->assertOk()
            ->assertJsonPath('data.amount', 100000)
            ->assertJsonCount(12, 'data.schedule');

        $this->postJson('/api/v1/calculator/estimate', [
            'project_id' => Project::query()->where('slug', 'galleria-moscow')->firstOrFail()->id,
            'amount' => 100000,
            'term_months' => 12,
        ])
            ->assertOk()
            ->assertJsonPath('data.termMonths', 12);
    }

    public function test_public_content_endpoints_return_pages_reviews_cases_and_blog(): void
    {
        $this->getJson('/api/v1/public/about')
            ->assertOk()
            ->assertJsonPath('data.key', 'about');

        $this->getJson('/api/v1/reviews')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/v1/case-studies')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/v1/blog/categories')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/v1/blog/posts')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/v1/blog/posts/warehouse-demand-2026')
            ->assertOk()
            ->assertJsonPath('data.slug', 'warehouse-demand-2026');
    }

    public function test_contact_lead_can_be_created(): void
    {
        $response = $this->postJson('/api/v1/contact-leads', [
            'full_name' => 'Новый Инвестор',
            'email' => 'lead@example.com',
            'phone' => '+7 999 111 22 33',
            'subject' => 'Нужна консультация',
            'source' => 'landing',
            'message' => 'Хочу узнать про доходность.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.status', 'new');

        $this->assertDatabaseHas('contact_leads', [
            'email' => 'lead@example.com',
            'status' => 'new',
        ]);
    }

}
