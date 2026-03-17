'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateWithdrawalMutation } from '@/entities/cabinet/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms/apply-api-form-errors';
import { withdrawFundsSchema, type WithdrawFundsFormValues } from '@/features/withdraw-funds/model/schema';

type WithdrawalRequestFormProps = {
  onSuccess?: () => void;
};

export function WithdrawalRequestForm({ onSuccess }: WithdrawalRequestFormProps) {
  const mutation = useCreateWithdrawalMutation();
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const form = useForm<WithdrawFundsFormValues>({
    resolver: zodResolver(withdrawFundsSchema),
    defaultValues: {
      amount: '',
      bank_name: '',
      bank_account: '',
      comment: '',
    },
  });

  async function onSubmit(values: WithdrawFundsFormValues) {
    setSummaryError(null);

    try {
      await mutation.mutateAsync({
        amount: Number(values.amount.replace(/\s+/g, '')),
        bank_name: values.bank_name,
        bank_account: values.bank_account,
        comment: values.comment || undefined,
      });
      toast.success('Заявка на вывод создана');
      form.reset();
      onSuccess?.();
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      setSummaryError(getApiErrorMessage(error, 'Не удалось создать заявку на вывод.'));
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
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Сумма вывода *</FormLabel>
              <FormControl>
                <Input {...field} name="amount" inputMode="numeric" autoComplete="off" placeholder="50000…" className="rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormDescription className="text-app-cabinet-muted">Вывод средств также оформляется только через заявку.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Банк *</FormLabel>
              <FormControl>
                <Input {...field} name="bank_name" autoComplete="off" placeholder="Сбербанк…" className="rounded-none border-app-cabinet-border shadow-none" />
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
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Счёт или карта *</FormLabel>
              <FormControl>
                <Input {...field} name="bank_account" spellCheck={false} autoComplete="off" placeholder="40817810… или 2200…" className="rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormDescription className="text-app-cabinet-muted">Используйте реквизиты, которые можно подтвердить при проверке заявки.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Комментарий</FormLabel>
              <FormControl>
                <Textarea {...field} name="comment" placeholder="Если реквизиты нужно проверить или уточнить…" className="min-h-24 rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong">
          {mutation.isPending ? 'Отправляем…' : 'Создать заявку на вывод'}
        </Button>
      </form>
    </Form>
  );
}
