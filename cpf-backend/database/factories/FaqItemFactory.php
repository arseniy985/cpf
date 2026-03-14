<?php

namespace Database\Factories;

use App\Modules\Content\Domain\Models\FaqItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FaqItem>
 */
class FaqItemFactory extends Factory
{
    protected $model = FaqItem::class;

    public function definition(): array
    {
        return [
            'group_name' => fake()->randomElement(['Инвестиции', 'Сделки']),
            'question' => fake()->unique()->sentence(6),
            'answer' => fake()->paragraph(),
            'sort_order' => fake()->numberBetween(1, 10),
            'is_published' => true,
        ];
    }
}
