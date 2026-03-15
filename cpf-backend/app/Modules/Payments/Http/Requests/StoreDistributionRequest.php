<?php

namespace App\Modules\Payments\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDistributionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'period_label' => ['required', 'string', 'max:120'],
            'period_start' => ['nullable', 'date'],
            'period_end' => ['nullable', 'date', 'after_or_equal:period_start'],
            'total_amount' => ['required', 'integer', 'min:1'],
            'payout_mode' => ['required', 'string', 'max:40', Rule::in(['manual', 'yookassa'])],
            'notes' => ['nullable', 'string'],
        ];
    }
}
