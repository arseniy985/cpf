<?php

namespace Database\Factories;

use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Catalog\Domain\Models\ProjectDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectDocument>
 */
class ProjectDocumentFactory extends Factory
{
    protected $model = ProjectDocument::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'title' => fake()->sentence(3),
            'kind' => fake()->randomElement(['memorandum', 'legal-opinion', 'financial-model']),
            'label' => 'PDF',
            'file_url' => fake()->url(),
            'is_public' => true,
            'sort_order' => fake()->numberBetween(1, 5),
        ];
    }
}
