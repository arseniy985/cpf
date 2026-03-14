<?php

namespace App\Modules\Compliance\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Compliance\Data\KycDocumentData;
use App\Modules\Compliance\Domain\Models\KycDocument;
use App\Modules\Compliance\Http\Requests\StoreKycDocumentRequest;
use App\Modules\Identity\Domain\Models\KycProfile;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KycDocumentController extends Controller
{
    public function index(): JsonResponse
    {
        $profile = request()->user()->load('kycProfile.documents')->kycProfile;

        return ApiResponse::success($profile ? KycDocumentData::collect($profile->documents) : []);
    }

    public function store(StoreKycDocumentRequest $request): JsonResponse
    {
        $profile = KycProfile::query()->firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'status' => 'draft',
                'legal_name' => $request->user()->name,
            ],
        );

        $file = $request->file('file');
        $path = $file->store('kyc-documents/'.$profile->id, 'private');

        $document = KycDocument::query()->create([
            'kyc_profile_id' => $profile->id,
            'kind' => $request->string('kind')->toString(),
            'status' => 'pending_review',
            'original_name' => $file->getClientOriginalName(),
            'disk' => 'private',
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
        ]);

        return ApiResponse::success(KycDocumentData::fromModel($document), 201);
    }

    public function download(KycDocument $kycDocument): StreamedResponse
    {
        $user = request()->user();

        abort_unless(
            $user?->id === $kycDocument->kycProfile->user_id || $user?->hasAnyRole(['admin', 'manager', 'compliance']),
            404,
        );

        return Storage::disk($kycDocument->disk)->download($kycDocument->path, $kycDocument->original_name);
    }
}
