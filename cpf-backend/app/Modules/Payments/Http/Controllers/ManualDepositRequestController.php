<?php

namespace App\Modules\Payments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Payments\Data\ManualDepositRequestData;
use App\Modules\Payments\Domain\Models\ManualDepositRequest;
use App\Modules\Payments\Http\Requests\StoreManualDepositReceiptRequest;
use App\Modules\Payments\Http\Requests\StoreManualDepositRequest;
use App\Modules\Payments\Services\ManualDepositRequestService;
use App\Support\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ManualDepositRequestController extends Controller
{
    public function __construct(
        private readonly ManualDepositRequestService $manualDepositRequestService,
    ) {}

    public function index(): JsonResponse
    {
        $user = request()->user();
        $this->manualDepositRequestService->expireStaleForUser($user);

        $requests = $user->manualDepositRequests()->latest()->get();

        return ApiResponse::success(ManualDepositRequestData::collect($requests));
    }

    public function show(ManualDepositRequest $manualDepositRequest): JsonResponse
    {
        abort_unless($manualDepositRequest->user_id === request()->user()->id, 404);

        $request = $this->manualDepositRequestService->expireIfStale($manualDepositRequest);

        return ApiResponse::success(ManualDepositRequestData::fromModel($request));
    }

    public function store(StoreManualDepositRequest $request): JsonResponse
    {
        $idempotencyKey = $request->header('Idempotency-Key');
        $existing = $this->manualDepositRequestService->findExistingRequest($request->user()->id, $idempotencyKey);

        if ($existing !== null) {
            return ApiResponse::success(ManualDepositRequestData::fromModel($existing));
        }

        try {
            $manualDepositRequest = $this->manualDepositRequestService->create(
                $request->user(),
                $request->validated(),
                $idempotencyKey,
            );
        } catch (QueryException $exception) {
            $manualDepositRequest = $this->manualDepositRequestService->findExistingRequest($request->user()->id, $idempotencyKey);

            if ($manualDepositRequest === null) {
                throw $exception;
            }
        }

        return ApiResponse::success(ManualDepositRequestData::fromModel($manualDepositRequest), Response::HTTP_CREATED);
    }

    public function uploadReceipt(
        StoreManualDepositReceiptRequest $request,
        ManualDepositRequest $manualDepositRequest,
    ): JsonResponse {
        abort_unless($manualDepositRequest->user_id === $request->user()->id, 404);

        if (in_array($manualDepositRequest->status, ['credited', 'rejected', 'cancelled', 'expired'], true)) {
            return ApiResponse::error(
                code: 'manual_deposit_receipt_locked',
                message: 'Для этой заявки больше нельзя загрузить подтверждение перевода.',
                status: Response::HTTP_UNPROCESSABLE_ENTITY,
                traceId: $request->attributes->get('trace_id'),
            );
        }

        $updatedRequest = $this->manualDepositRequestService->uploadReceipt(
            $manualDepositRequest,
            $request->file('file'),
        );

        return ApiResponse::success(ManualDepositRequestData::fromModel($updatedRequest));
    }

    public function cancel(ManualDepositRequest $manualDepositRequest): JsonResponse
    {
        abort_unless($manualDepositRequest->user_id === request()->user()->id, 404);

        if (! in_array($manualDepositRequest->status, ['awaiting_transfer', 'awaiting_user_clarification'], true)) {
            return ApiResponse::error(
                code: 'manual_deposit_cannot_be_cancelled',
                message: 'Заявка уже передана в необратимую обработку.',
                status: Response::HTTP_UNPROCESSABLE_ENTITY,
                traceId: request()->attributes->get('trace_id'),
            );
        }

        $updatedRequest = $this->manualDepositRequestService->cancel($manualDepositRequest);

        return ApiResponse::success(ManualDepositRequestData::fromModel($updatedRequest));
    }

    public function downloadReceipt(ManualDepositRequest $manualDepositRequest): StreamedResponse
    {
        $user = request()->user();

        abort_unless(
            $user?->id === $manualDepositRequest->user_id || $user?->hasAnyRole(['admin', 'manager', 'accountant']),
            404,
        );

        abort_unless($manualDepositRequest->receipt_path !== null, 404);

        return Storage::disk($manualDepositRequest->receipt_disk ?? 'private')
            ->download($manualDepositRequest->receipt_path, $manualDepositRequest->receipt_original_name ?? 'receipt');
    }
}
