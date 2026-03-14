<?php

namespace Database\Factories;

use App\Models\User;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InvestmentApplication>
 */
class InvestmentApplicationFactory extends Factory
{
    protected $model = InvestmentApplication::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'amount' => fake()->numberBetween(10_000, 500_000),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'notes' => fake()->sentence(),
        ];
    }
}
