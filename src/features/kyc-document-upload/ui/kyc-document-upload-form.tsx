'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUploadKycDocumentMutation } from '@/entities/cabinet/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { kycDocumentKinds } from '@/features/kyc-document-upload/model/constants';

export function KycDocumentUploadForm() {
  const mutation = useUploadKycDocumentMutation();
  const [kind, setKind] = useState('passport');
  const [file, setFile] = useState<File | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();

        if (!file) {
          return;
        }

        try {
          await mutation.mutateAsync({ kind, file });
          setFile(null);
        } catch {
          return;
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="kyc-document-kind">Тип документа</Label>
        <Select value={kind} onValueChange={setKind}>
          <SelectTrigger id="kyc-document-kind">
            <SelectValue placeholder="Выберите тип документа" />
          </SelectTrigger>
          <SelectContent>
            {kycDocumentKinds.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="kyc-document-file">Файл</Label>
        <Input
          id="kyc-document-file"
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </div>

      {mutation.isError ? (
        <p className="text-sm text-rose-600">
          {getApiErrorMessage(mutation.error, 'Не удалось загрузить документ.')}
        </p>
      ) : null}

      <Button type="submit" width="full" size="lg" disabled={mutation.isPending || !file}>
        {mutation.isPending ? 'Загружаем...' : 'Загрузить документ'}
      </Button>
    </form>
  );
}
