import type {
  FieldPath,
  FieldValues,
  UseFormSetError,
} from 'react-hook-form';
import { ApiClientError } from '@/shared/api/http/client';

export function applyApiFormErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
) {
  if (!(error instanceof ApiClientError) || !error.errors) {
    return;
  }

  for (const [field, messages] of Object.entries(error.errors)) {
    const message = messages[0];

    if (!message) {
      continue;
    }

    setError(field as FieldPath<TFieldValues>, {
      type: 'server',
      message,
    });
  }
}
