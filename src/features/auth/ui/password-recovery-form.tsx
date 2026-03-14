'use client';

import { useState } from 'react';
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '@/entities/viewer/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  recoveryRequestSchema,
  recoveryResetSchema,
} from '@/features/auth/model/schemas';

type RecoveryRequestValues = z.infer<typeof recoveryRequestSchema>;
type RecoveryResetValues = z.infer<typeof recoveryResetSchema>;

export function PasswordRecoveryForm({
  initialEmail,
  onBack,
}: {
  initialEmail: string;
  onBack: () => void;
}) {
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const [requestedEmail, setRequestedEmail] = useState(initialEmail);
  const [isCodeRequested, setIsCodeRequested] = useState(false);

  const requestForm = useForm<RecoveryRequestValues>({
    resolver: zodResolver(recoveryRequestSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  const resetForm = useForm<RecoveryResetValues>({
    resolver: zodResolver(recoveryResetSchema),
    defaultValues: {
      code: '',
      password: '',
      password_confirmation: '',
    },
  });

  async function requestCode(values: RecoveryRequestValues) {
    try {
      await forgotPasswordMutation.mutateAsync(values);
      setRequestedEmail(values.email);
      setIsCodeRequested(true);
    } catch (error) {
      applyApiFormErrors(error, requestForm.setError);
    }
  }

  async function resetPassword(values: RecoveryResetValues) {
    try {
      await resetPasswordMutation.mutateAsync({
        email: requestedEmail,
        ...values,
      });
      resetForm.reset();
    } catch (error) {
      applyApiFormErrors(error, resetForm.setError);
    }
  }

  return (
    <div className="space-y-4">
      {!isCodeRequested ? (
        <Form {...requestForm}>
          <form className="space-y-4" onSubmit={requestForm.handleSubmit(requestCode)}>
            <FormField
              control={requestForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email для восстановления</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {forgotPasswordMutation.isError ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {getApiErrorMessage(forgotPasswordMutation.error, 'Не удалось отправить код восстановления.')}
              </p>
            ) : null}

            <Button type="submit" width="full" size="lg" disabled={forgotPasswordMutation.isPending}>
              {forgotPasswordMutation.isPending ? 'Отправляем...' : 'Получить код восстановления'}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...resetForm}>
          <form className="space-y-4" onSubmit={resetForm.handleSubmit(resetPassword)}>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4 text-sm text-indigo-800">
              Код восстановления отправлен на <strong>{requestedEmail}</strong>.
            </div>

            <FormField
              control={resetForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Код из письма</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      maxLength={6}
                      {...field}
                      onChange={(event) => field.onChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={resetForm.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Повторите новый пароль</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {resetPasswordMutation.isError ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {getApiErrorMessage(resetPasswordMutation.error, 'Не удалось обновить пароль.')}
              </p>
            ) : null}

            {resetPasswordMutation.isSuccess ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                Пароль обновлен. Теперь можно вернуться ко входу и пройти подтверждение.
              </div>
            ) : null}

            <Button type="submit" width="full" size="lg" disabled={resetPasswordMutation.isPending}>
              {resetPasswordMutation.isPending ? 'Сохраняем...' : 'Сменить пароль'}
            </Button>
          </form>
        </Form>
      )}

      <Button
        type="button"
        variant="ghost"
        width="full"
        onClick={() => {
          setIsCodeRequested(false);
          onBack();
        }}
      >
        <ArrowLeft className="h-4 w-4" />
        Вернуться ко входу
      </Button>
    </div>
  );
}
