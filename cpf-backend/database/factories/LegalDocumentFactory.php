<?php

namespace Database\Factories;

use App\Modules\Content\Domain\Models\LegalDocument;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<LegalDocument>
 */
class LegalDocumentFactory extends Factory
{
    protected $model = LegalDocument::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(10, 99),
            'title' => $title,
            'summary' => fake()->paragraph(),
            'document_type' => fake()->randomElement(['agreement', 'risk', 'policy']),
            'file_url' => fake()->url(),
            'status' => 'published',
            'published_at' => now()->subDay(),
        ];
    }
}
