'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, MailCheck, ShieldCheck } from 'lucide-react';
import { useSession } from '@/features/session/model/use-session';
import { useEnrollOwnerMutation } from '@/entities/viewer/api/hooks';
import { formatRoleLabel } from '@/shared/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { InvestorPayoutProfileForm } from '@/features/profile-settings/ui/investor-payout-profile-form';
import { ProfileSettingsForm } from '@/features/profile-settings/ui/profile-settings-form';

export default function DashboardSettingsPage() {
  const router = useRouter();
  const session = useSession();
  const enrollOwnerMutation = useEnrollOwnerMutation();
  const user = session.user;
  const canBecomeOwner = Boolean(user && !user.roles.includes('project_owner'));

  useEffect(() => {
    const intent = typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('intent')
      : null;

    if (!user || intent !== 'owner' || !canBecomeOwner || enrollOwnerMutation.isPending) {
      return;
    }

    void enrollOwnerMutation
      .mutateAsync()
      .then(() => {
        router.push('/owner');
      })
      .catch(() => undefined);
  }, [canBecomeOwner, enrollOwnerMutation, router, user]);

  if (!session.token || !user) {
    return null;
  }

  return (
    <div className="space-y-7">
      <CabinetPageHeader
        eyebrow="Профиль"
        title="Настройки профиля"
        description="Главная форма вынесена в центр, служебные статусы собраны в отдельный тихий блок справа."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <CabinetSurface
          eyebrow="Основное"
          title="Профиль"
          description="Основные данные, которые видит команда платформы."
          variant="hero"
        >
          <ProfileSettingsForm user={user} />
        </CabinetSurface>

        <div className="space-y-6">
          {canBecomeOwner ? (
            <CabinetSurface
              eyebrow="Новый режим"
              title="Стать владельцем объекта"
              description="Откроем owner workspace без второго аккаунта: роли объединятся в одном профиле, а инвесторские данные сохранятся."
              variant="subtle"
            >
              <div className="rounded-[24px] border border-cabinet-accent/20 bg-cabinet-accent-soft px-5 py-5">
                <p className="text-sm leading-relaxed text-cabinet-ink">
                  После активации появятся разделы компании, KYB, проекты, раунды и выплаты. Это безопасное расширение текущего аккаунта.
                </p>
                <Button
                  className="mt-4 rounded-full bg-cabinet-accent-strong text-cabinet-panel-strong hover:bg-cabinet-accent-strong/92"
                  disabled={enrollOwnerMutation.isPending}
                  onClick={async () => {
                    await enrollOwnerMutation.mutateAsync();
                    router.push('/owner');
                  }}
                >
                  {enrollOwnerMutation.isPending ? 'Открываем owner workspace…' : 'Стать владельцем'}
                </Button>
              </div>
            </CabinetSurface>
          ) : null}

          <CabinetSurface
            eyebrow="Выплаты"
            title="Автоматические выплаты"
            description="Здесь сохраняется способ получения выплат по доходу и возвратам."
            variant="subtle"
          >
            <InvestorPayoutProfileForm user={user} />
          </CabinetSurface>

          <CabinetSurface
            eyebrow="Статусы"
            title="Доступ и статусы"
            description="Краткая сводка по текущему пользователю."
            variant="subtle"
          >
            <div className="space-y-4">
              <div className="rounded-[22px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
                <div className="flex items-center gap-3">
                  <MailCheck className="h-4 w-4 text-cabinet-accent-strong" />
                  <div>
                    <p className="text-sm font-medium text-cabinet-ink">Почта</p>
                    <p className="text-sm text-cabinet-muted-ink">{user.emailVerifiedAt ? 'Подтверждена' : 'Не подтверждена'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[22px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-cabinet-accent-strong" />
                  <div>
                    <p className="text-sm font-medium text-cabinet-ink">Проверка профиля</p>
                    <p className="text-sm text-cabinet-muted-ink">{user.kycStatus ?? 'Не начат'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[22px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-4 w-4 text-cabinet-accent-strong" />
                  <div>
                    <p className="text-sm font-medium text-cabinet-ink">Роли</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <Badge key={role} className="rounded-full border border-cabinet-border bg-cabinet-panel-strong text-cabinet-muted-ink">
                          {formatRoleLabel(role)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CabinetSurface>

          <CabinetSurface
            eyebrow="Сессия"
            title="Сессия"
            description="Управление входом в кабинет."
            variant="subtle"
          >
            <div className="grid gap-3">
              <Button
                variant="ghost"
                width="full"
                className="justify-start rounded-full text-cabinet-muted-ink hover:bg-cabinet-panel hover:text-cabinet-ink"
                onClick={() => void session.logout()}
              >
                Выйти из кабинета
              </Button>
            </div>
          </CabinetSurface>
        </div>
      </div>
    </div>
  );
}
