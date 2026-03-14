'use client';

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
import { useCreateWithdrawalMutation } from '@/entities/cabinet/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  withdrawFundsSchema,
  type WithdrawFundsFormValues,
} from '@/features/withdraw-funds/model/schema';

export function WithdrawFundsForm() {
  const mutation = useCreateWithdrawalMutation();
  const form = useForm<WithdrawFundsFormValues>({
    resolver: zodResolver(withdrawFundsSchema),
    defaultValues: {
      amount: '10000',
      bank_name: 'Т-Банк',
      bank_account: '2200700000000000',
      comment: '',
    },
  });

  async function onSubmit(values: WithdrawFundsFormValues) {
    try {
      const amount = Number(values.amount);

      if (!Number.isFinite(amount) || amount < 1000) {
        form.setError('amount', { type: 'manual', message: 'Минимальный вывод 1 000 ₽.' });
        return;
      }

      await mutation.mutateAsync({
        amount,
        comment: values.comment || undefined,
        bank_name: values.bank_name,
        bank_account: values.bank_account,
      });
    } catch (error) {
      applyApiFormErrors(error, form.setError);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сумма вывода</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1000}
                  step={1000}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название банка</FormLabel>
              <FormControl>
                <Input placeholder="Название банка" {...field} />
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
              <FormLabel>Счет или номер карты</FormLabel>
              <FormControl>
                <Input placeholder="Счет или номер карты" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Комментарий для оператора</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Комментарий для оператора" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isError ? (
          <p className="text-sm text-rose-600">
            {getApiErrorMessage(mutation.error, 'Не удалось создать заявку на вывод.')}
          </p>
        ) : null}

        <Button type="submit" width="full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? 'Отправляем заявку...' : 'Отправить заявку'}
        </Button>
      </form>
    </Form>
  );
}
