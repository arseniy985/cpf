<?php

namespace App\Modules\CRM\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CRM\Domain\Models\ContactLead;
use App\Modules\CRM\Http\Requests\StoreContactLeadRequest;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class ContactLeadController extends Controller
{
    public function store(StoreContactLeadRequest $request): JsonResponse
    {
        $lead = ContactLead::query()->create([
            ...$request->validated(),
            'status' => 'new',
        ]);

        return ApiResponse::success([
            'id' => $lead->id,
            'status' => $lead->status,
        ], 201);
    }
}
