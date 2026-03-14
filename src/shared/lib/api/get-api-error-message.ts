import { ApiClientError } from '@/shared/api/http/client';

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiClientError) {
    const firstDetail = error.errors
      ? Object.values(error.errors).flat()[0]
      : null;

    if (firstDetail) {
      return firstDetail;
    }

    return error.message;
  }

  return fallback;
}
