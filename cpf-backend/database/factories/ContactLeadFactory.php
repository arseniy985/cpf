<?php

namespace Database\Factories;

use App\Modules\CRM\Domain\Models\ContactLead;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactLead>
 */
class ContactLeadFactory extends Factory
{
    protected $model = ContactLead::class;

    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'subject' => fake()->sentence(4),
            'source' => fake()->randomElement(['landing', 'seo', 'partner']),
            'message' => fake()->paragraph(),
            'status' => 'new',
        ];
    }
}
