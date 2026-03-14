'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpsertKycProfileMutation } from '@/entities/cabinet/api/hooks';
import type { KycProfile } from '@/entities/cabinet/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  kycProfileSchema,
  type KycProfileFormValues,
} from '@/features/kyc-profile/model/schema';

export function KycProfileForm({
  profile,
}: {
  profile: KycProfile | null;
}) {
  const mutation = useUpsertKycProfileMutation();
  const form = useForm<KycProfileFormValues>({
    resolver: zodResolver(kycProfileSchema),
    defaultValues: {
      legal_name: profile?.legalName ?? '',
      birth_date: profile?.birthDate ?? '',
      tax_id: profile?.taxId ?? '',
      document_number: profile?.documentNumber ?? '',
      address: profile?.address ?? '',
      notes: profile?.notes ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      legal_name: profile?.legalName ?? '',
      birth_date: profile?.birthDate ?? '',
      tax_id: profile?.taxId ?? '',
      document_number: profile?.documentNumber ?? '',
      address: profile?.address ?? '',
      notes: profile?.notes ?? '',
    });
  }, [form, profile]);

  async function onSubmit(values: KycProfileFormValues) {
    try {
      await mutation.mutateAsync({
        ...values,
        birth_date: values.birth_date || undefined,
        tax_id: values.tax_id || undefined,
        document_number: values.document_number || undefined,
        address: values.address || undefined,
        notes: values.notes || undefined,
      });
    } catch (error) {
      applyApiFormErrors(error, form.setError);
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="legal_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ФИО как в документе</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата рождения</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tax_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ИНН</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="document_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Номер документа</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Адрес</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Комментарий для менеджера</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isError ? (
          <p className="text-sm text-rose-600 md:col-span-2">
            {getApiErrorMessage(mutation.error, 'Не удалось сохранить KYC-профиль.')}
          </p>
        ) : null}

        <div className="md:col-span-2">
          <Button type="submit" size="lg" disabled={mutation.isPending}>
            {mutation.isPending ? 'Сохраняем...' : 'Сохранить анкету'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
