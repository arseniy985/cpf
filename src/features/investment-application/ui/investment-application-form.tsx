'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useSession } from '@/features/session/model/use-session';
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
import { useCreateInvestmentApplicationMutation } from '@/entities/cabinet/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import { createInvestmentApplicationSchema } from '@/features/investment-application/model/schema';

export function InvestmentApplicationForm({
  projectId,
  minInvestment,
  onRequireAuth,
  onAmountPreviewChange,
}: {
  projectId: string;
  minInvestment: number;
  onRequireAuth: () => void;
  onAmountPreviewChange?: (amount: number) => void;
}) {
  const session = useSession();
  const mutation = useCreateInvestmentApplicationMutation();
  const schema = createInvestmentApplicationSchema(minInvestment);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: String(minInvestment),
      notes: '',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!session.token) {
      onRequireAuth();
      return;
    }

    try {
      const amount = Number(values.amount);

      if (!Number.isFinite(amount) || amount < minInvestment) {
        form.setError('amount', {
          type: 'manual',
          message: `Минимальная сумма ${minInvestment.toLocaleString('ru-RU')} ₽.`,
        });
        return;
      }

      await mutation.mutateAsync({
        projectId,
        amount,
        notes: values.notes || undefined,
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
              <FormLabel>Сумма заявки</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={minInvestment}
                  step={1000}
                  {...field}
                  onChange={(event) => {
                    const nextAmount = event.target.value;
                    field.onChange(nextAmount);
                    onAmountPreviewChange?.(Number(nextAmount));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Комментарий</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isError ? (
          <p className="text-sm text-rose-600">
            {getApiErrorMessage(mutation.error, 'Не удалось отправить заявку на участие.')}
          </p>
        ) : null}

        {mutation.isSuccess ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            Заявка создана. Дальше ее можно подтвердить в кабинете.
          </div>
        ) : null}

        <Button type="submit" width="full" size="lg" disabled={mutation.isPending}>
          {session.token
            ? mutation.isPending ? 'Отправляем заявку...' : 'Подать заявку'
            : 'Войти и инвестировать'}
        </Button>
      </form>
    </Form>
  );
}
