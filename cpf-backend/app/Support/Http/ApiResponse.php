<?php

namespace App\Support\Http;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ApiResponse
{
    public static function success(mixed $data, int $status = Response::HTTP_OK, array $meta = []): JsonResponse
    {
        $payload = ['data' => $data];

        if ($meta !== []) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }

    public static function paginated(LengthAwarePaginator $paginator, mixed $data): JsonResponse
    {
        return self::success($data, Response::HTTP_OK, [
            'currentPage' => $paginator->currentPage(),
            'lastPage' => $paginator->lastPage(),
            'perPage' => $paginator->perPage(),
            'total' => $paginator->total(),
        ]);
    }

    public static function error(
        string $code,
        string $message,
        int $status,
        ?array $details = null,
        ?string $traceId = null,
    ): JsonResponse {
        $payload = [
            'code' => $code,
            'message' => $message,
            'traceId' => $traceId,
        ];

        if ($details !== null) {
            $payload['details'] = $details;
        }

        return response()->json($payload, $status);
    }
}
