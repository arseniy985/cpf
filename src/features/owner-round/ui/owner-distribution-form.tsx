'use client';

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
import { useCreateOwnerDistributionMutation } from '@/entities/owner-round/api/hooks';
import { applyApiFormErrors } from '@/shared/lib/forms';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { ownerDistributionSchema, type OwnerDistributionFormValues } from '../model/schemas';

const emptyValues: OwnerDistributionFormValues = {
  title: '',
  period_label: '',
  period_start: '',
  period_end: '',
  total_amount: '',
  payout_mode: 'manual',
  notes: '',
};

export function OwnerDistributionForm({
  roundSlug,
}: {
  roundSlug: string;
}) {
  const createMutation = useCreateOwnerDistributionMutation();
  const form = useForm<OwnerDistributionFormValues>({
    resolver: zodResolver(ownerDistributionSchema),
    defaultValues: emptyValues,
    mode: 'onBlur',
  });

  async function onSubmit(values: OwnerDistributionFormValues) {
    const totalAmount = Number(values.total_amount);

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      form.setError('total_amount', { type: 'manual', message: 'Укажите сумму больше 0.' });
      return;
    }

    try {
      await createMutation.mutateAsync({
        roundSlug,
        payload: {
          title: values.title,
          period_label: values.period_label,
          period_start: values.period_start || undefined,
          period_end: values.period_end || undefined,
          total_amount: totalAmount,
          payout_mode: values.payout_mode,
          notes: values.notes || undefined,
        },
      });
      toast.success('Распределение собрано');
      form.reset(emptyValues);
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      toast.error(getApiErrorMessage(error, 'Не удалось сформировать распределение.'));
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4 lg:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название выплаты</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder="Мартовская Выплата…"
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="period_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Период</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder="Март 2026…"
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="period_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Начало периода</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" type="date" value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="period_end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Конец периода</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" type="date" value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="total_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сумма к распределению</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  inputMode="numeric"
                  placeholder="24000…"
                  type="number"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>Сумма будет распределена между подтвержденными участниками этого раунда.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payout_mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Режим выплаты</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger aria-label="Выберите режим выплаты">
                    <SelectValue placeholder="Выберите способ выплаты…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="manual">Ручной реестр</SelectItem>
                  <SelectItem value="yookassa">Автоматическая выплата через YooKassa</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Если для автоматической выплаты не хватает данных, запись перейдет в ручную обработку.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Комментарий к выплате</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  autoComplete="off"
                  placeholder="Что важно знать команде перед запуском выплат…"
                  rows={4}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <Button disabled={createMutation.isPending} type="submit">
            {createMutation.isPending ? 'Собираем…' : 'Сформировать реестр выплат'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
