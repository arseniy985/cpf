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
      className="rounded-[16px] border border-cabinet-border/80 bg-cabinet-panel px-4 py-4"
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
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-cabinet-border/80 bg-cabinet-panel-strong text-cabinet-accent-strong">
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">ID</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-cabinet-ink">Новая загрузка</p>
          <p className="mt-1 text-sm leading-relaxed text-cabinet-muted-ink text-pretty">
            Выберите тип документа и прикрепите файл в читаемом качестве. После загрузки ему будет присвоен статус проверки.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-2">
          <Label htmlFor="kyc-document-kind">Тип документа</Label>
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger id="kyc-document-kind" className="rounded-[12px] border-cabinet-border bg-cabinet-panel-strong">
              <SelectValue placeholder="Выберите тип документа…" />
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
            className="rounded-[12px] border-cabinet-border bg-cabinet-panel-strong file:mr-3"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {mutation.isError ? (
        <p className="mt-4 text-sm text-rose-600">
          {getApiErrorMessage(mutation.error, 'Не удалось загрузить документ.')}
        </p>
      ) : null}

      <div className="mt-4">
        <Button type="submit" width="full" size="lg" className="rounded-[12px]" disabled={mutation.isPending || !file}>
          {mutation.isPending ? 'Загружаем…' : 'Загрузить документ'}
        </Button>
      </div>
    </form>
  );
}
