'use client';

import { KeyRound, MailCheck, ShieldCheck } from 'lucide-react';
import { useSession } from '@/features/session/model/use-session';
import { formatRoleLabel } from '@/shared/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { ProfileSettingsForm } from '@/features/profile-settings/ui/profile-settings-form';

export default function DashboardSettingsPage() {
  const session = useSession();

  if (!session.token || !session.user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Настройки"
        title="Настройки профиля"
        description="Контакты пользователя, текущий режим безопасности и управление активной сессией."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <CabinetSurface title="Профиль" description="Основные данные, которые видит команда платформы.">
          <ProfileSettingsForm user={session.user} />
        </CabinetSurface>

        <div className="space-y-6">
          <CabinetSurface title="Доступ и статусы" description="Краткая сводка по текущему пользователю.">
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <MailCheck className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-950">Почта</p>
                    <p className="text-sm text-slate-600">{session.user.emailVerifiedAt ? 'Подтвержден' : 'Не подтвержден'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-950">Проверка профиля</p>
                    <p className="text-sm text-slate-600">{session.user.kycStatus ?? 'Не начат'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-3">
                  <KeyRound className="h-4 w-4 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-950">Роли</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {session.user.roles.map((role) => (
                        <Badge key={role} className="rounded-md border border-slate-200 bg-white text-slate-700">
                          {formatRoleLabel(role)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CabinetSurface>

          <CabinetSurface title="Сессия" description="Управление входом в кабинет.">
            <div className="grid gap-3">
              <Button
                variant="ghost"
                width="full"
                className="justify-start rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950"
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
