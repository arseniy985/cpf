<?php

namespace App\Modules\Origination\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOwnerProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $projectId = $this->route('project')?->id;

        return [
            'slug' => ['sometimes', 'string', 'max:160', Rule::unique('projects', 'slug')->ignore($projectId, 'id')],
            'title' => ['sometimes', 'string', 'max:255'],
            'excerpt' => ['sometimes', 'string', 'max:500'],
            'description' => ['sometimes', 'string'],
            'thesis' => ['nullable', 'string'],
            'risk_summary' => ['nullable', 'string'],
            'location' => ['sometimes', 'string', 'max:255'],
            'asset_type' => ['sometimes', 'string', 'max:60'],
            'risk_level' => ['sometimes', 'string', 'max:40'],
            'payout_frequency' => ['sometimes', 'string', 'max:40'],
            'min_investment' => ['sometimes', 'integer', 'min:10000'],
            'target_amount' => ['sometimes', 'integer', 'min:100000'],
            'target_yield' => ['sometimes', 'numeric', 'min:1'],
            'term_months' => ['sometimes', 'integer', 'min:1'],
            'cover_image_url' => ['nullable', 'url'],
            'hero_metric' => ['nullable', 'string', 'max:120'],
        ];
    }
}
