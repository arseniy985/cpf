'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateManualDepositMutation } from '@/entities/cabinet/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms/apply-api-form-errors';
import { manualDepositSchema, type ManualDepositFormValues } from '@/features/manual-deposit/model/schema';

type ManualDepositRequestFormProps = {
  onSuccess?: () => void;
};

export function ManualDepositRequestForm({ onSuccess }: ManualDepositRequestFormProps) {
  const mutation = useCreateManualDepositMutation();
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const form = useForm<ManualDepositFormValues>({
    resolver: zodResolver(manualDepositSchema),
    defaultValues: {
      amount: '',
      payer_name: '',
      payer_bank: '',
      payer_account_last4: '',
      comment: '',
    },
  });

  async function onSubmit(values: ManualDepositFormValues) {
    setSummaryError(null);

    try {
      await mutation.mutateAsync({
        amount: Number(values.amount.replace(/\s+/g, '')),
        payer_name: values.payer_name,
        payer_bank: values.payer_bank || undefined,
        payer_account_last4: values.payer_account_last4 || undefined,
        comment: values.comment || undefined,
      });
      toast.success('Заявка на пополнение создана');
      form.reset();
      onSuccess?.();
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      setSummaryError(getApiErrorMessage(error, 'Не удалось создать заявку на пополнение.'));
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {summaryError ? (
          <div className="border border-app-cabinet-danger/20 bg-app-cabinet-danger/10 px-4 py-3 text-sm text-app-cabinet-danger" aria-live="polite">
            {summaryError}
          </div>
        ) : null}

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Сумма заявки *</FormLabel>
              <FormControl>
                <Input {...field} name="amount" inputMode="numeric" autoComplete="off" placeholder="100000…" className="rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormDescription className="text-app-cabinet-muted">Пополнение доступно только через заявку и ручную проверку перевода.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Плательщик *</FormLabel>
              <FormControl>
                <Input {...field} name="payer_name" autoComplete="name" placeholder="Иван Иванов…" className="rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormDescription className="text-app-cabinet-muted">Имя плательщика должно совпадать с отправителем перевода.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="payer_bank"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Банк отправителя</FormLabel>
                <FormControl>
                  <Input {...field} name="payer_bank" autoComplete="off" placeholder="Т-Банк…" className="rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payer_account_last4"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Последние 4 цифры счёта</FormLabel>
                <FormControl>
                  <Input {...field} name="payer_account_last4" inputMode="numeric" spellCheck={false} autoComplete="off" placeholder="1234…" className="rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Комментарий</FormLabel>
              <FormControl>
                <Textarea {...field} name="comment" placeholder="Например, перевод будет с расчётного счёта…" className="min-h-24 rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormDescription className="text-app-cabinet-muted">После создания заявки загрузите подтверждение перевода в истории заявок.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong">
          {mutation.isPending ? 'Отправляем…' : 'Создать заявку на пополнение'}
        </Button>
      </form>
    </Form>
  );
}
