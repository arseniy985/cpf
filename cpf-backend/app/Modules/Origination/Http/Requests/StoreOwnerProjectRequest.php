<?php

namespace App\Modules\Origination\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOwnerProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:160', 'unique:projects,slug'],
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'thesis' => ['nullable', 'string'],
            'risk_summary' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'asset_type' => ['required', 'string', 'max:60'],
            'risk_level' => ['required', 'string', 'max:40'],
            'payout_frequency' => ['required', 'string', 'max:40'],
            'min_investment' => ['required', 'integer', 'min:10000'],
            'target_amount' => ['required', 'integer', 'min:100000'],
            'target_yield' => ['required', 'numeric', 'min:1'],
            'term_months' => ['required', 'integer', 'min:1'],
            'cover_image_url' => ['nullable', 'url'],
        ];
    }
}
