<?php

namespace Database\Factories;

use App\Models\User;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PaymentTransaction>
 */
class PaymentTransactionFactory extends Factory
{
    protected $model = PaymentTransaction::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'gateway' => 'yookassa',
            'type' => 'deposit',
            'status' => fake()->randomElement(['pending', 'succeeded', 'canceled']),
            'amount' => fake()->numberBetween(5_000, 200_000),
            'currency' => 'RUB',
            'external_id' => (string) Str::uuid(),
            'confirmation_url' => fake()->url(),
            'payload' => ['demo' => true],
            'processed_at' => now()->subMinutes(fake()->numberBetween(5, 120)),
        ];
    }
}
