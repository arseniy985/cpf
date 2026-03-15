'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateOwnerBankProfileMutation } from '@/entities/owner-account/api/hooks';
import type { OwnerBankProfile } from '@/entities/owner-account/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  ownerBankProfileSchema,
  type OwnerBankProfileFormValues,
} from '../model/schemas';

const payoutOptions = [
  { value: 'bank_transfer', label: 'Банковский перевод' },
];

function mapValues(bankProfile: OwnerBankProfile): OwnerBankProfileFormValues {
  return {
    payout_method: bankProfile.payoutMethod,
    recipient_name: bankProfile.recipientName ?? '',
    bank_name: bankProfile.bankName ?? '',
    bank_bik: bankProfile.bankBik ?? '',
    bank_account: bankProfile.bankAccount ?? '',
    correspondent_account: bankProfile.correspondentAccount ?? '',
    notes: bankProfile.notes ?? '',
  };
}

export function OwnerBankProfileForm({ bankProfile }: { bankProfile: OwnerBankProfile }) {
  const mutation = useUpdateOwnerBankProfileMutation();
  const form = useForm<OwnerBankProfileFormValues>({
    resolver: zodResolver(ownerBankProfileSchema),
    defaultValues: mapValues(bankProfile),
  });

  useEffect(() => {
    form.reset(mapValues(bankProfile));
  }, [bankProfile, form]);

  async function onSubmit(values: OwnerBankProfileFormValues) {
    try {
      await mutation.mutateAsync({
        ...values,
        notes: values.notes || undefined,
      });
      toast.success('Реквизиты сохранены');
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      toast.error(getApiErrorMessage(error, 'Не удалось сохранить реквизиты.'));
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="payout_method"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Способ расчетов</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите способ…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {payoutOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipient_name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Получатель</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormDescription>Укажите компанию, на счет которой будут поступать средства.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Банк</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank_bik"
          render={({ field }) => (
            <FormItem>
              <FormLabel>БИК</FormLabel>
              <FormControl>
                <Input autoComplete="off" inputMode="numeric" spellCheck={false} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank_account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Расчетный счет</FormLabel>
              <FormControl>
                <Input autoComplete="off" inputMode="numeric" spellCheck={false} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="correspondent_account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Корреспондентский счет</FormLabel>
              <FormControl>
                <Input autoComplete="off" inputMode="numeric" spellCheck={false} {...field} />
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
              <FormLabel>Операционный комментарий</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Сохраняем…' : 'Сохранить реквизиты'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
