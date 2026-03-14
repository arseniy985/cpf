<?php

namespace App\Modules\Investing\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Data\ProjectDocumentData;
use App\Modules\Catalog\Domain\Models\ProjectDocument;
use App\Modules\Content\Data\LegalDocumentData;
use App\Modules\Content\Domain\Models\LegalDocument;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;

class CabinetDocumentController extends Controller
{
    public function index(): JsonResponse
    {
        $user = request()->user()->load('investmentApplications.project.documents');

        $projectIds = $user->investmentApplications
            ->whereIn('status', ['approved', 'confirmed'])
            ->pluck('project_id')
            ->values();

        $projectDocuments = ProjectDocument::query()
            ->whereIn('project_id', $projectIds)
            ->where('is_public', true)
            ->orderBy('sort_order')
            ->get();

        $legalDocuments = LegalDocument::query()
            ->published()
            ->latest('published_at')
            ->get();

        return ApiResponse::success([
            'projectDocuments' => ProjectDocumentData::collect($projectDocuments),
            'legalDocuments' => LegalDocumentData::collect($legalDocuments),
        ]);
    }
}
