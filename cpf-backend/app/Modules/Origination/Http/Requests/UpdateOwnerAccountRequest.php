<?php

namespace App\Modules\Origination\Http\Requests;

use App\Modules\Origination\Domain\Models\OwnerAccount;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOwnerAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $accountId = OwnerAccount::query()
            ->whereHas('members', fn ($query) => $query->where('user_id', $this->user()?->id))
            ->value('id');

        return [
            'display_name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:160',
                Rule::unique('owner_accounts', 'slug')->ignore($accountId, 'id'),
            ],
            'overview' => ['nullable', 'string', 'max:2000'],
            'website_url' => ['nullable', 'url'],
        ];
    }
}
