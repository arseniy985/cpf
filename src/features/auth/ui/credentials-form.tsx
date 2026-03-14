'use client';

import Link from 'next/link';
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
import { useLoginMutation, useRegisterMutation } from '@/entities/viewer/api/hooks';
import type { AuthUser, EmailCodePurpose } from '@/entities/viewer/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { isLoginCodeRequired, isRegistrationCodeRequired } from '@/shared/config/auth';
import { applyApiFormErrors } from '@/shared/lib/forms';
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
      token: string;
      user: AuthUser;
    };

type CredentialsFormProps = {
  mode: AuthMode;
  alternateHref: string;
  alternateLabel: string;
  submitLabel: string;
  onRecovery: () => void;
  onSuccess: (result: AuthSuccessResult) => void;
};

export function CredentialsForm({
  mode,
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
      name: '',
      phone: '',
      email: mode === 'login' ? 'investor@cpf.local' : '',
      password: mode === 'login' ? 'password' : '',
      password_confirmation: '',
    },
  });

  async function onSubmit(values: AuthCredentialsFormValues) {
    try {
      const response = mode === 'register'
        ? await registerMutation.mutateAsync({
          name: values.name ?? '',
          email: values.email,
          phone: values.phone || undefined,
          password: values.password,
          password_confirmation: values.password_confirmation ?? '',
          device_name: 'next-web',
        })
        : await loginMutation.mutateAsync({
          email: values.email,
          password: values.password,
          device_name: 'next-web',
        });

      if ('token' in response.data) {
        onSuccess({
          kind: 'authenticated',
          token: response.data.token,
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
                    <Input placeholder="Иван Иванов" {...field} />
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
                    <Input placeholder="+7 999 000 00 00" {...field} />
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
                <Input type="email" placeholder="investor@cpf.local" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
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
                  <Input type="password" placeholder="••••••••" {...field} />
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
          className="block text-center text-sm font-bold text-slate-600 hover:text-indigo-700"
        >
          {alternateLabel}
        </Link>
      </form>
    </Form>
  );
}
