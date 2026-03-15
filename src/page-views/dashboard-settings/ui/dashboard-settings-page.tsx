'use client';

import { KeyRound, MailCheck, ShieldCheck } from 'lucide-react';
import { useSession } from '@/features/session/model/use-session';
import { formatRoleLabel } from '@/shared/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { InvestorPayoutProfileForm } from '@/features/profile-settings/ui/investor-payout-profile-form';
import { ProfileSettingsForm } from '@/features/profile-settings/ui/profile-settings-form';

export default function DashboardSettingsPage() {
  const session = useSession();

  if (!session.token || !session.user) {
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
          <ProfileSettingsForm user={session.user} />
        </CabinetSurface>

        <div className="space-y-6">
          <CabinetSurface
            eyebrow="Выплаты"
            title="Автоматические выплаты"
            description="Здесь сохраняется способ получения выплат по доходу и возвратам."
            variant="subtle"
          >
            <InvestorPayoutProfileForm user={session.user} />
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
                    <p className="text-sm text-cabinet-muted-ink">{session.user.emailVerifiedAt ? 'Подтверждена' : 'Не подтверждена'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[22px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-cabinet-accent-strong" />
                  <div>
                    <p className="text-sm font-medium text-cabinet-ink">Проверка профиля</p>
                    <p className="text-sm text-cabinet-muted-ink">{session.user.kycStatus ?? 'Не начат'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[22px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-4 w-4 text-cabinet-accent-strong" />
                  <div>
                    <p className="text-sm font-medium text-cabinet-ink">Роли</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {session.user.roles.map((role) => (
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
