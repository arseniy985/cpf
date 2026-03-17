'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';
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
import { useLoginMutation, useRegisterMutation } from '@/entities/viewer/api/hooks';
import type { AccountType, AuthUser, EmailCodePurpose } from '@/entities/viewer/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { isLoginCodeRequired, isRegistrationCodeRequired } from '@/shared/config/auth';
import { applyApiFormErrors } from '@/shared/lib/forms';
import { normalizePhoneNumber } from '@/shared/lib/forms/phone';
import { PhoneInput } from '@/shared/ui/phone-input';
import {
  type AuthCredentialsFormValues,
  getCredentialsSchema,
} from '@/features/auth/model/schemas';
import type { AuthMode } from '@/features/auth/model/auth-flow';

type AuthSuccessResult =
  | {
      kind: 'code';
      email: string;
      purpose: EmailCodePurpose;
    }
  | {
      kind: 'authenticated';
      user: AuthUser;
    };

type CredentialsFormProps = {
  mode: AuthMode;
  intent?: AccountType;
  alternateHref: string;
  alternateLabel: string;
  submitLabel: string;
  onRecovery: () => void;
  onSuccess: (result: AuthSuccessResult) => void;
};

export function CredentialsForm({
  mode,
  intent = 'investor',
  alternateHref,
  alternateLabel,
  submitLabel,
  onRecovery,
  onSuccess,
}: CredentialsFormProps) {
  const schema = getCredentialsSchema(mode);
  const registerRequiresCode = isRegistrationCodeRequired();
  const loginRequiresCode = isLoginCodeRequired();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const form = useForm<AuthCredentialsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      account_type: intent,
      name: '',
      phone: '',
      email: mode === 'login' ? 'investor@cpf.local' : '',
      password: mode === 'login' ? 'password' : '',
      password_confirmation: '',
    },
  });

  useEffect(() => {
    if (mode !== 'register') {
      return;
    }

    form.setValue('account_type', intent, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [form, intent, mode]);

  async function onSubmit(values: AuthCredentialsFormValues) {
    try {
      const response = mode === 'register'
        ? await registerMutation.mutateAsync({
          account_type: values.account_type ?? intent,
          name: values.name ?? '',
          email: values.email,
          phone: normalizePhoneNumber(values.phone ?? '') || undefined,
          password: values.password,
          password_confirmation: values.password_confirmation ?? '',
          device_name: 'next-web',
        })
        : await loginMutation.mutateAsync({
          email: values.email,
          password: values.password,
          device_name: 'next-web',
        });

      if ('user' in response.data) {
        onSuccess({
          kind: 'authenticated',
          user: response.data.user,
        });
        return;
      }

      onSuccess({
        kind: 'code',
        email: values.email,
        purpose: response.data.purpose,
      });
    } catch (error) {
      applyApiFormErrors(error, form.setError);
    }
  }

  const mutationError = loginMutation.error ?? registerMutation.error;
  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {mode === 'register' ? (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя и фамилия</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" placeholder="Иван Иванов…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <PhoneInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : null}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  placeholder="name@company.ru…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Минимум 8 символов…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === 'register' ? (
          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Повторите пароль</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" placeholder="Повторите пароль…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )}
          />
        ) : null}

        {mutationError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {getApiErrorMessage(mutationError, 'Не удалось продолжить авторизацию.')}
          </p>
        ) : null}

        <Button type="submit" width="full" size="lg" disabled={isPending}>
          {isPending
            ? mode === 'register'
              ? !registerRequiresCode
                ? 'Создаем кабинет...'
                : 'Отправляем код...'
              : loginRequiresCode
                ? 'Отправляем код...'
                : 'Входим...'
            : submitLabel}
        </Button>

        {mode === 'login' ? (
          <Button
            type="button"
            variant="link"
            width="full"
            className="h-auto px-0 py-0 text-sm font-bold text-indigo-600 hover:text-indigo-800"
            onClick={onRecovery}
          >
            Не помню пароль
          </Button>
        ) : null}

        <Link
          href={alternateHref}
          className="inline-flex w-full items-center justify-center gap-2 text-center text-sm font-bold text-slate-600 hover:text-indigo-700"
        >
          {alternateLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </form>
    </Form>
  );
}
