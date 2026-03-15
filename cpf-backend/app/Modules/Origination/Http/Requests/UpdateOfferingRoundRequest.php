<?php

namespace App\Modules\Origination\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOfferingRoundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $roundId = $this->route('round')?->id;

        return [
            'slug' => ['sometimes', 'string', 'max:160', Rule::unique('offering_rounds', 'slug')->ignore($roundId, 'id')],
            'title' => ['sometimes', 'string', 'max:255'],
            'target_amount' => ['sometimes', 'integer', 'min:100000'],
            'min_investment' => ['sometimes', 'integer', 'min:1000'],
            'target_yield' => ['sometimes', 'numeric', 'min:0.1'],
            'payout_frequency' => ['sometimes', 'string', 'max:40', Rule::in(['monthly', 'quarterly', 'at_maturity'])],
            'term_months' => ['sometimes', 'integer', 'min:1'],
            'oversubscription_allowed' => ['boolean'],
            'opens_at' => ['nullable', 'date'],
            'closes_at' => ['nullable', 'date', 'after:opens_at'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
