'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useUpdateInvestorPayoutProfileMutation } from '@/entities/viewer/api/hooks';
import type { AuthUser } from '@/entities/viewer/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { formatDateTime } from '@/shared/lib/format';
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

const investorPayoutProfileSchema = z.object({
  payout_method_label: z.string().trim().max(160, 'Слишком длинное название').optional(),
  payout_token: z.string().trim().max(4096, 'Токен слишком длинный').optional(),
});

type InvestorPayoutProfileFormValues = z.infer<typeof investorPayoutProfileSchema>;

export function InvestorPayoutProfileForm({ user }: { user: AuthUser }) {
  const mutation = useUpdateInvestorPayoutProfileMutation();
  const form = useForm<InvestorPayoutProfileFormValues>({
    resolver: zodResolver(investorPayoutProfileSchema),
    defaultValues: {
      payout_method_label: user.investorPayoutProfile?.payoutMethodLabel ?? '',
      payout_token: '',
    },
  });

  useEffect(() => {
    form.reset({
      payout_method_label: user.investorPayoutProfile?.payoutMethodLabel ?? '',
      payout_token: '',
    });
  }, [form, user.investorPayoutProfile?.payoutMethodLabel]);

  async function onSubmit(values: InvestorPayoutProfileFormValues) {
    try {
      await mutation.mutateAsync({
        provider: 'yookassa',
        payout_method_label: values.payout_method_label || undefined,
        payout_token: values.payout_token || undefined,
      });
      form.reset({
        payout_method_label: values.payout_method_label ?? '',
        payout_token: '',
      });
      toast.success('Способ получения выплат сохранен');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Не удалось сохранить способ получения выплат.'));
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="rounded-[22px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
          <p className="text-sm font-medium text-cabinet-ink">Текущий статус</p>
          <p className="mt-2 text-sm text-cabinet-muted-ink">
            {user.investorPayoutProfile?.isReady
              ? 'Автоматические выплаты подключены.'
              : 'Автоматические выплаты пока не подключены. Если токен не сохранен, выплата уйдет в ручную очередь.'}
          </p>
          {user.investorPayoutProfile?.lastVerifiedAt ? (
            <p className="mt-2 text-xs text-cabinet-muted-ink">
              Последнее обновление: {formatDateTime(user.investorPayoutProfile.lastVerifiedAt)}
            </p>
          ) : null}
        </div>

        <FormField
          control={form.control}
          name="payout_method_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название способа выплаты</FormLabel>
              <FormControl>
                <Input className="rounded-2xl" placeholder="Например, основная карта для выплат" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payout_token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Токен выплаты YooKassa</FormLabel>
              <FormControl>
                <Input
                  className="rounded-2xl"
                  placeholder="Вставьте токен, выпущенный для автоматических выплат"
                  autoComplete="off"
                  spellCheck={false}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="rounded-full bg-cabinet-ink text-cabinet-panel-strong hover:bg-cabinet-ink/92"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Сохраняем…' : 'Сохранить способ выплаты'}
        </Button>
      </form>
    </Form>
  );
}
