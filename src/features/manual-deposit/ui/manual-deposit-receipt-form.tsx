'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUploadManualDepositReceiptMutation } from '@/entities/cabinet/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';

type ManualDepositReceiptFormProps = {
  requestId: string;
};

export function ManualDepositReceiptForm({ requestId }: ManualDepositReceiptFormProps) {
  const inputId = useId();
  const mutation = useUploadManualDepositReceiptMutation();
  const [file, setFile] = useState<File | null>(null);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={async (event) => {
        event.preventDefault();

        if (!file) {
          return;
        }

        await mutation.mutateAsync({ id: requestId, file });
        setFile(null);
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-cabinet-ink">
          Подтверждение перевода
        </label>
        <input
          id={inputId}
          name="manual_deposit_receipt"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block w-full rounded-[18px] border border-dashed border-cabinet-border bg-white/85 px-4 py-3 text-sm text-cabinet-muted-ink file:mr-3 file:rounded-full file:border-0 file:bg-cabinet-accent-soft file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-cabinet-accent-strong"
        />
      </div>

      {mutation.isError ? (
        <p aria-live="polite" className="text-sm text-rose-600">
          {getApiErrorMessage(mutation.error, 'Не удалось загрузить подтверждение перевода.')}
        </p>
      ) : null}

      <Button type="submit" variant="outline" disabled={mutation.isPending || file === null}>
        {mutation.isPending ? 'Загружаем подтверждение…' : 'Отправить чек менеджеру'}
      </Button>
    </form>
  );
}
