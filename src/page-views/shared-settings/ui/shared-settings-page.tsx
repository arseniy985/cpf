'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEnrollOwnerMutation, useUpdateInvestorPayoutProfileMutation, useUpdateProfileMutation } from '@/entities/viewer/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { profileSettingsSchema, type ProfileSettingsFormValues } from '@/features/profile-settings/model/schema';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms/apply-api-form-errors';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

export default function SharedSettingsPage() {
  const session = useSession();
  const updateProfileMutation = useUpdateProfileMutation();
  const updatePayoutMutation = useUpdateInvestorPayoutProfileMutation();
  const enrollOwnerMutation = useEnrollOwnerMutation();
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: session.user?.name ?? '',
      phone: session.user?.phone ?? '',
      notifications_email: session.user?.notificationPreferences?.email ?? true,
      notifications_sms: session.user?.notificationPreferences?.sms ?? false,
      notifications_marketing: session.user?.notificationPreferences?.marketing ?? false,
    },
  });

  async function onSubmit(values: ProfileSettingsFormValues) {
    setSummaryError(null);

    try {
      await updateProfileMutation.mutateAsync({
        name: values.name,
        phone: values.phone || undefined,
        notification_preferences: {
          email: values.notifications_email,
          sms: values.notifications_sms,
          marketing: values.notifications_marketing,
        },
      });
      toast.success('Профиль обновлён');
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      setSummaryError(getApiErrorMessage(error, 'Не удалось обновить профиль.'));
    }
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Общее пространство"
        title="Настройки аккаунта"
        description="Здесь находятся профиль, контакты, способ получения выплат, безопасность и доступные режимы в одном аккаунте."
        summary={(
          <>
            <AppStatusBadge status={session.user?.emailVerifiedAt ? 'email verified' : 'email not verified'} />
            <AppStatusBadge status={session.user?.kycStatus ?? 'draft'} />
            {session.user?.ownerAccount ? <AppStatusBadge status={session.user.ownerAccount.status} /> : null}
          </>
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Профиль" title="Контакты и базовые данные" description="Контактные поля используются для уведомлений, ручной проверки заявок и операционной связи.">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {summaryError ? (
                <div className="border border-app-cabinet-danger/20 bg-app-cabinet-danger/10 px-4 py-3 text-sm text-app-cabinet-danger" aria-live="polite">
                  {summaryError}
                </div>
              ) : null}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-app-cabinet-text">Имя *</FormLabel>
                    <FormControl>
                      <Input {...field} name="name" autoComplete="name" placeholder="Иван Иванов…" className="rounded-none border-app-cabinet-border shadow-none" />
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
                    <FormLabel className="text-sm font-medium text-app-cabinet-text">Телефон</FormLabel>
                    <FormControl>
                      <Input {...field} name="phone" type="tel" autoComplete="tel" placeholder="+7 900 000-00-00…" className="rounded-none border-app-cabinet-border shadow-none" />
                    </FormControl>
                    <FormDescription className="text-app-cabinet-muted">Нужен для связи по заявкам и проверкам.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong">
                {updateProfileMutation.isPending ? 'Сохраняем…' : 'Сохранить профиль'}
              </Button>
            </form>
          </Form>
        </AppSurface>

        <AppSurface eyebrow="Выплаты" title="Способ получения выплат" description="Настройка влияет на обработку фактических выплат по инвестиционному портфелю.">
          <div className="space-y-4">
            <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">{session.user?.investorPayoutProfile?.payoutMethodLabel ?? 'Не настроено'}</p>
              <p className="mt-1 text-sm text-app-cabinet-muted">Статус: {session.user?.investorPayoutProfile?.status ?? 'draft'}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-5 text-app-cabinet-text"
              onClick={async () => {
                try {
                  await updatePayoutMutation.mutateAsync({
                    provider: 'yookassa',
                    payout_method_label: 'ЮKassa payout profile',
                  });
                  toast.success('Способ получения выплат обновлён');
                } catch (error) {
                  toast.error(getApiErrorMessage(error, 'Не удалось обновить профиль выплат.'));
                }
              }}
            >
              {updatePayoutMutation.isPending ? 'Сохраняем…' : 'Обновить способ получения'}
            </Button>
          </div>
        </AppSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Уведомления" title="Настройки уведомлений" description="Параметры синхронизируются с профилем аккаунта и дальше используются транзакционными каналами.">
          <div className="space-y-3">
            {[
              ['notifications_email', 'Email-уведомления', 'Статусы заявок, проверок и выплат на почту.'],
              ['notifications_sms', 'SMS-уведомления', 'Короткие операционные уведомления для критичных статусов.'],
              ['notifications_marketing', 'Информационные рассылки', 'Редкие продуктовые письма и служебные обновления.'],
            ].map(([name, label, description]) => (
              <FormField
                key={name}
                control={form.control}
                name={name as 'notifications_email' | 'notifications_sms' | 'notifications_marketing'}
                render={({ field }) => (
                  <FormItem className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <FormControl>
                        <input
                          type="checkbox"
                          name={field.name}
                          checked={field.value}
                          onChange={(event) => field.onChange(event.target.checked)}
                          className="mt-1 h-4 w-4 rounded-none border-app-cabinet-border text-app-cabinet-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-cabinet-accent"
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="cursor-pointer text-sm font-medium text-app-cabinet-text">{label}</FormLabel>
                        <FormDescription className="mt-1 text-app-cabinet-muted">{description}</FormDescription>
                      </div>
                    </label>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </AppSurface>

        <AppSurface eyebrow="Роли" title="Доступные режимы аккаунта" description="Один аккаунт может работать и как investor, и как owner. Второго профиля не создаётся.">
          <div className="grid gap-3">
            <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">Investor workspace</p>
              <p className="mt-1 text-sm text-app-cabinet-muted">Всегда доступен в текущем аккаунте.</p>
            </div>
            <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-app-cabinet-text">Owner workspace</p>
                  <p className="mt-1 text-sm text-app-cabinet-muted">{session.user?.ownerAccount ? 'Режим уже подключён и доступен в sidebar.' : 'Режим ещё не подключён к текущему аккаунту.'}</p>
                </div>
                {session.user?.ownerAccount ? <AppStatusBadge status={session.user.ownerAccount.status} /> : null}
              </div>
            </div>
            {!session.user?.ownerAccount ? (
              <Button
                type="button"
                className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong"
                onClick={async () => {
                  try {
                    await enrollOwnerMutation.mutateAsync();
                    toast.success('Режим владельца подключён');
                  } catch (error) {
                    toast.error(getApiErrorMessage(error, 'Не удалось подключить режим владельца.'));
                  }
                }}
              >
                {enrollOwnerMutation.isPending ? 'Подключаем…' : 'Подключить режим owner'}
              </Button>
            ) : null}
          </div>
        </AppSurface>

        <AppSurface eyebrow="Безопасность" title="Сессии и служебные статусы" description="Блок остаётся строгим и служебным: только статусы, без лишних промо-элементов.">
          <div className="grid gap-3">
            <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">Почта</p>
              <AppStatusBadge status={session.user?.emailVerifiedAt ? 'email verified' : 'email not verified'} className="mt-3" />
            </div>
            <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">KYC</p>
              <AppStatusBadge status={session.user?.kycStatus ?? 'draft'} className="mt-3" />
            </div>
            <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">Текущая сессия</p>
              <p className="mt-2 text-sm text-app-cabinet-muted">Сессия управляется через текущий токен авторизации. Повторный вход не требуется при переключении между режимами.</p>
            </div>
          </div>
        </AppSurface>
      </div>
    </div>
  );
}
