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
import { useCreateManualDepositMutation } from '@/entities/cabinet/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  manualDepositSchema,
  type ManualDepositFormValues,
} from '@/features/manual-deposit/model/schema';

type ManualDepositFormProps = {
  onCreated?: () => void;
};

export function ManualDepositForm({ onCreated }: ManualDepositFormProps) {
  const mutation = useCreateManualDepositMutation();
  const form = useForm<ManualDepositFormValues>({
    resolver: zodResolver(manualDepositSchema),
    defaultValues: {
      amount: '50000',
      payer_name: '',
      payer_bank: '',
      payer_account_last4: '',
      comment: '',
    },
  });

  async function onSubmit(values: ManualDepositFormValues) {
    try {
      const amount = Number(values.amount);

      if (!Number.isFinite(amount) || amount < 1000) {
        form.setError('amount', { type: 'manual', message: 'Минимальное пополнение 1 000 ₽.' });
        return;
      }

      if (values.payer_account_last4 && !/^\d{4}$/.test(values.payer_account_last4)) {
        form.setError('payer_account_last4', { type: 'manual', message: 'Укажите последние 4 цифры счёта.' });
        return;
      }

      await mutation.mutateAsync({
        amount,
        payer_name: values.payer_name,
        payer_bank: values.payer_bank || undefined,
        payer_account_last4: values.payer_account_last4 || undefined,
        comment: values.comment || undefined,
      });

      form.reset({
        amount: values.amount,
        payer_name: values.payer_name,
        payer_bank: values.payer_bank ?? '',
        payer_account_last4: values.payer_account_last4 ?? '',
        comment: '',
      });
      onCreated?.();
    } catch (error) {
      applyApiFormErrors(error, form.setError);
    }
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сумма перевода</FormLabel>
              <FormControl>
                <Input type="number" min={1000} step={1000} inputMode="numeric" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Плательщик</FormLabel>
              <FormControl>
                <Input autoComplete="name" placeholder="ФИО или название компании…" {...field} />
              </FormControl>
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
                <FormLabel>Банк плательщика</FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="Например, Т-Банк…" {...field} />
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
                <FormLabel>Последние 4 цифры счёта</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="5501…"
                    spellCheck={false}
                    {...field}
                  />
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
              <FormLabel>Комментарий для менеджера</FormLabel>
              <FormControl>
                <Textarea
                  autoComplete="off"
                  placeholder="Когда планируете отправить перевод, с какого счёта или что важно учесть…"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isError ? (
          <p aria-live="polite" className="text-sm text-rose-600">
            {getApiErrorMessage(mutation.error, 'Не удалось создать заявку на ручное пополнение.')}
          </p>
        ) : null}

        <Button type="submit" width="full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? 'Создаём заявку…' : 'Получить реквизиты для перевода'}
        </Button>
      </form>
    </Form>
  );
}
