'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowRight, BriefcaseBusiness, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  async function onSubmit(values: AuthCredentialsFormValues) {
    try {
      const response = mode === 'register'
        ? await registerMutation.mutateAsync({
          account_type: values.account_type ?? intent,
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
          <FormField
            control={form.control}
            name="account_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Какой кабинет нужен?</FormLabel>
                <FormControl>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        value: 'investor',
                        title: 'Инвестор',
                        text: 'Сделки, портфель, документы и выплаты в одном контуре.',
                        icon: BriefcaseBusiness,
                        tone: 'from-[#16345d] via-[#1d4b77] to-[#0f233f]',
                      },
                      {
                        value: 'owner',
                        title: 'Владелец объекта',
                        text: 'Профиль компании, KYB, проекты, раунды и owner payouts.',
                        icon: Building2,
                        tone: 'from-[#6e321d] via-[#8b421d] to-[#4e1f10]',
                      },
                    ].map((option) => {
                      const isActive = field.value === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`group relative overflow-hidden rounded-[28px] border p-4 text-left transition-all duration-300 ${
                            isActive
                              ? 'border-slate-900 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]'
                              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${option.tone} transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                          <div className="relative z-10 flex min-h-32 flex-col justify-between gap-5">
                            <div className="flex items-center justify-between gap-3">
                              <Badge
                                variant="outline"
                                className={isActive
                                  ? 'border-white/20 bg-white/10 text-white'
                                  : 'border-slate-200 bg-slate-50 text-slate-600'}
                              >
                                Сценарий входа
                              </Badge>
                              <option.icon className={isActive ? 'h-5 w-5 text-white' : 'h-5 w-5 text-slate-700'} />
                            </div>
                            <div>
                              <p className="text-lg font-black tracking-tight">{option.title}</p>
                              <p className={isActive ? 'mt-2 text-sm text-white/78' : 'mt-2 text-sm text-slate-600'}>{option.text}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

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
          className="inline-flex w-full items-center justify-center gap-2 text-center text-sm font-bold text-slate-600 hover:text-indigo-700"
        >
          {alternateLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </form>
    </Form>
  );
}
