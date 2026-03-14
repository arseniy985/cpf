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
import { useCreateDepositMutation } from '@/entities/cabinet/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  depositFundsSchema,
  type DepositFundsFormValues,
} from '@/features/deposit-funds/model/schema';

export function DepositFundsForm() {
  const mutation = useCreateDepositMutation();
  const form = useForm<DepositFundsFormValues>({
    resolver: zodResolver(depositFundsSchema),
    defaultValues: {
      amount: '15000',
    },
  });

  async function onSubmit(values: DepositFundsFormValues) {
    try {
      const amount = Number(values.amount);

      if (!Number.isFinite(amount) || amount < 1000) {
        form.setError('amount', { type: 'manual', message: 'Минимальное пополнение 1 000 ₽.' });
        return;
      }

      const response = await mutation.mutateAsync({
        amount,
      });

      if (response.data.confirmationUrl) {
        window.open(response.data.confirmationUrl, '_blank', 'noopener,noreferrer');
      }
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
              <FormLabel>Сумма пополнения</FormLabel>
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

        {mutation.isError ? (
          <p className="text-sm text-rose-600">
            {getApiErrorMessage(mutation.error, 'Не удалось создать платеж.')}
          </p>
        ) : null}

        <Button type="submit" width="full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? 'Переходим к оплате...' : 'Перейти к оплате'}
        </Button>
      </form>
    </Form>
  );
}
