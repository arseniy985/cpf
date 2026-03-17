'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useKycProfileQuery, useUpsertKycProfileMutation, useUploadKycDocumentMutation } from '@/entities/cabinet/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms/apply-api-form-errors';
import { kycProfileSchema, type KycProfileFormValues } from '@/features/kyc-profile/model/schema';

const documentKinds = [
  { key: 'passport', label: 'Паспорт' },
  { key: 'tax_id', label: 'ИНН' },
  { key: 'address_proof', label: 'Подтверждение адреса' },
];

export function InvestorKycForm() {
  const profileQuery = useKycProfileQuery();
  const saveMutation = useUpsertKycProfileMutation();
  const uploadMutation = useUploadKycDocumentMutation();
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const form = useForm<KycProfileFormValues>({
    resolver: zodResolver(kycProfileSchema),
    values: {
      legal_name: profileQuery.data?.data?.legalName ?? '',
      birth_date: profileQuery.data?.data?.birthDate ?? '',
      tax_id: profileQuery.data?.data?.taxId ?? '',
      document_number: profileQuery.data?.data?.documentNumber ?? '',
      address: profileQuery.data?.data?.address ?? '',
      notes: profileQuery.data?.data?.notes ?? '',
    },
  });

  async function onSubmit(values: KycProfileFormValues) {
    setSummaryError(null);

    try {
      await saveMutation.mutateAsync(values);
      toast.success('Анкета сохранена');
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      setSummaryError(getApiErrorMessage(error, 'Не удалось сохранить анкету.'));
    }
  }

  return (
    <div className="space-y-6">
      {summaryError ? (
        <div className="border border-app-cabinet-danger/20 bg-app-cabinet-danger/10 px-4 py-3 text-sm text-app-cabinet-danger" aria-live="polite">
          {summaryError}
        </div>
      ) : null}

      <Form {...form}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="legal_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">ФИО *</FormLabel>
                <FormControl>
                  <Input {...field} name="legal_name" autoComplete="name" placeholder="Иванов Иван Иванович…" className="rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormDescription className="text-app-cabinet-muted">Данные должны совпадать с документом.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Дата рождения</FormLabel>
                <FormControl>
                  <Input {...field} type="date" name="birth_date" className="rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormDescription className="text-app-cabinet-muted">Используйте дату из паспорта.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">ИНН</FormLabel>
                <FormControl>
                  <Input {...field} name="tax_id" inputMode="numeric" spellCheck={false} autoComplete="off" placeholder="123456789012…" className="rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormDescription className="text-app-cabinet-muted">Укажите при наличии.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="document_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Серия и номер документа</FormLabel>
                <FormControl>
                  <Input {...field} name="document_number" spellCheck={false} autoComplete="off" placeholder="4510 123456…" className="rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormDescription className="text-app-cabinet-muted">Формат зависит от типа документа.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Адрес регистрации</FormLabel>
                <FormControl>
                  <Textarea {...field} name="address" placeholder="Город, улица, дом, квартира…" className="min-h-24 rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormDescription className="text-app-cabinet-muted">Нужен полный адрес из документа или подтверждения адреса.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Комментарий для менеджера</FormLabel>
                <FormControl>
                  <Textarea {...field} name="notes" placeholder="Если нужно пояснить загрузку документа или несоответствие…" className="min-h-28 rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormDescription className="text-app-cabinet-muted">Поле необязательно, но помогает ускорить проверку.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button type="submit" className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong">
              {saveMutation.isPending ? 'Сохраняем…' : 'Сохранить анкету'}
            </Button>
          </div>
        </form>
      </Form>

      <div className="grid gap-4 md:grid-cols-3">
        {documentKinds.map((document) => (
          <label key={document.key} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
            <span className="block text-sm font-semibold text-app-cabinet-text">{document.label}</span>
            <span className="mt-1 block text-sm leading-6 text-app-cabinet-muted">
              JPG, PNG или PDF до 10&nbsp;MB.
            </span>
            <input
              className="mt-4 block w-full text-sm text-app-cabinet-muted file:mr-4 file:border-0 file:bg-app-cabinet-secondary file:px-3 file:py-2 file:font-medium file:text-app-cabinet-text"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              aria-label={`Загрузить ${document.label}`}
              onChange={async (event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  return;
                }

                try {
                  await uploadMutation.mutateAsync({
                    kind: document.key,
                    file,
                  });
                  toast.success(`${document.label} загружен`);
                } catch (error) {
                  toast.error(getApiErrorMessage(error, 'Не удалось загрузить документ.'));
                } finally {
                  event.currentTarget.value = '';
                }
              }}
            />
            <span className="mt-3 block text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">
              {uploadMutation.isPending ? 'Загрузка…' : 'Готово к загрузке'}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
