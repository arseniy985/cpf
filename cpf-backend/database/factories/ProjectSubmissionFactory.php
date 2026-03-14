<?php

namespace Database\Factories;

use App\Modules\Origination\Domain\Models\ProjectSubmission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectSubmission>
 */
class ProjectSubmissionFactory extends Factory
{
    protected $model = ProjectSubmission::class;

    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'company_name' => fake()->company(),
            'project_name' => fake()->sentence(3),
            'asset_type' => 'commercial_real_estate',
            'target_amount' => fake()->numberBetween(10_000_000, 90_000_000),
            'message' => fake()->paragraph(),
            'status' => 'new',
        ];
    }
}
