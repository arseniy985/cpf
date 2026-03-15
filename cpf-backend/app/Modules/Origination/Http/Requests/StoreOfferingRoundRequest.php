<?php

namespace App\Modules\Origination\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOfferingRoundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'string', 'exists:projects,id'],
            'slug' => ['required', 'string', 'max:160', 'unique:offering_rounds,slug'],
            'title' => ['required', 'string', 'max:255'],
            'target_amount' => ['required', 'integer', 'min:100000'],
            'min_investment' => ['required', 'integer', 'min:1000'],
            'target_yield' => ['required', 'numeric', 'min:0.1'],
            'payout_frequency' => ['required', 'string', 'max:40', Rule::in(['monthly', 'quarterly', 'at_maturity'])],
            'term_months' => ['required', 'integer', 'min:1'],
            'oversubscription_allowed' => ['boolean'],
            'opens_at' => ['nullable', 'date'],
            'closes_at' => ['nullable', 'date', 'after:opens_at'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
