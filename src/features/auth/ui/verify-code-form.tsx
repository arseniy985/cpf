'use client';

import { ArrowLeft } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
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
import {
  useRequestEmailCodeMutation,
  useVerifyEmailCodeMutation,
} from '@/entities/viewer/api/hooks';
import type { AuthUser } from '@/entities/viewer/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import { verifyCodeSchema } from '@/features/auth/model/schemas';
import type { VerificationContext } from '@/features/auth/model/auth-flow';

type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;

export function VerifyCodeForm({
  context,
  onBack,
  onSuccess,
}: {
  context: VerificationContext;
  onBack: () => void;
  onSuccess: (result: { user: AuthUser }) => void;
}) {
  const verifyCodeMutation = useVerifyEmailCodeMutation();
  const requestCodeMutation = useRequestEmailCodeMutation();
  const form = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: '',
    },
  });

  async function onSubmit(values: VerifyCodeFormValues) {
    try {
      const response = await verifyCodeMutation.mutateAsync({
        email: context.email,
        code: values.code,
        purpose: context.purpose,
        device_name: 'next-web',
      });

      onSuccess({
        user: response.data.user,
      });
    } catch (error) {
      applyApiFormErrors(error, form.setError);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4 text-sm text-indigo-800">
          Код отправлен на <strong>{context.email}</strong>. Цель подтверждения:{' '}
          <strong>{context.purpose}</strong>.
        </div>

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Код подтверждения</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  placeholder="123456"
                  maxLength={6}
                  {...field}
                  onChange={(event) => field.onChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {verifyCodeMutation.isError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {getApiErrorMessage(verifyCodeMutation.error, 'Не удалось подтвердить код.')}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="submit" width="full" size="lg" disabled={verifyCodeMutation.isPending}>
            {verifyCodeMutation.isPending ? 'Подтверждаем...' : 'Подтвердить и войти'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            width="full"
            disabled={requestCodeMutation.isPending}
            onClick={async () => {
              try {
                await requestCodeMutation.mutateAsync({
                  email: context.email,
                  purpose: context.purpose,
                });
              } catch {
                return;
              }
            }}
          >
            {requestCodeMutation.isPending ? 'Отправляем...' : 'Отправить код повторно'}
          </Button>
        </div>

        {requestCodeMutation.isError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {getApiErrorMessage(requestCodeMutation.error, 'Не удалось отправить код повторно.')}
          </p>
        ) : null}

        <Button type="button" variant="ghost" width="full" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Вернуться к данным
        </Button>
      </form>
    </Form>
  );
}
