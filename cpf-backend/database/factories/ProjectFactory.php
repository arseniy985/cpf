<?php

namespace Database\Factories;

use App\Modules\Catalog\Domain\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(10, 99),
            'title' => $title,
            'excerpt' => fake()->sentence(),
            'description' => fake()->paragraphs(3, true),
            'thesis' => fake()->sentence(),
            'risk_summary' => fake()->sentence(),
            'location' => fake()->city(),
            'asset_type' => 'commercial_real_estate',
            'status' => 'published',
            'funding_status' => 'collecting',
            'risk_level' => 'moderate',
            'payout_frequency' => 'monthly',
            'min_investment' => 10000,
            'target_amount' => fake()->numberBetween(10_000_000, 50_000_000),
            'current_amount' => fake()->numberBetween(1_000_000, 10_000_000),
            'target_yield' => fake()->randomFloat(2, 12, 24),
            'term_months' => fake()->numberBetween(12, 36),
            'cover_image_url' => fake()->imageUrl(1200, 800, 'business'),
            'hero_metric' => fake()->randomFloat(1, 12, 24).'% годовых',
            'is_featured' => fake()->boolean(),
            'published_at' => now()->subDay(),
        ];
    }
}
