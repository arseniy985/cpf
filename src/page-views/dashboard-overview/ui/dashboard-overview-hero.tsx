import type { ReactNode } from 'react';
import { BellRing, BriefcaseBusiness, MailCheck, ShieldCheck, WalletCards } from 'lucide-react';
import type { AuthUser } from '@/entities/viewer/api/types';
import type { DashboardSummary } from '@/entities/cabinet/api/types';
import { formatMoney } from '@/shared/lib/format';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { StatusBadge } from '@/shared/ui/status-badge';

type DashboardOverviewHeroProps = {
  summary: DashboardSummary;
  user: AuthUser;
};

export function DashboardOverviewHero({
  summary,
  user,
}: DashboardOverviewHeroProps) {
  return (
    <CabinetSurface
      eyebrow="Финансовый статус"
      title={<>Ликвидность, <span className="text-cabinet-accent-strong">портфель</span> и доступ к операциям</>}
      description="На этой панели собраны деньги на счёте, капитал в активных сделках и текущий статус проверки профиля."
      variant="hero"
    >
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[18px] border border-cabinet-ink/90 bg-cabinet-ink p-6 text-cabinet-panel-strong shadow-[0_18px_36px_rgba(17,35,63,0.18)]">
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cabinet-accent-soft/90">
            <WalletCards className="h-4 w-4" />
            Свободный остаток
          </div>
          <p className="mt-5 font-mono text-[36px] font-semibold tracking-[-0.05em] sm:text-[44px]">
            {formatMoney(summary.walletBalance)}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/74 text-pretty">
            Средства доступны для новой заявки, пополнения сделки или вывода, если профиль уже подтверждён.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <MetricInset
              label="Капитал в портфеле"
              value={formatMoney(summary.portfolioAmount)}
              hint="Подтверждённые участия, уже закреплённые в сделках"
            />
            <MetricInset
              label="Запрошено к выводу"
              value={formatMoney(summary.pendingWithdrawals)}
              hint="Заявки, которые находятся в обработке"
            />
          </div>
        </div>

        <div className="grid gap-3">
          <MetricPane
            label="Активные заявки"
            value={String(summary.applicationsCount)}
            hint="Черновики, согласование и подтверждение участия"
            icon={<BriefcaseBusiness className="h-4 w-4" />}
          />
          <MetricPane
            label="Новые события"
            value={String(summary.unreadNotifications)}
            hint="Изменения по платежам, проверке и сделкам"
            icon={<BellRing className="h-4 w-4" />}
          />
          <div className="rounded-[16px] border border-cabinet-border/80 bg-cabinet-panel-strong p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">
                  Допуск к операциям
                </p>
                <p className="mt-2 text-sm leading-relaxed text-cabinet-muted-ink text-pretty">
                  После подтверждения профиля становятся доступны полные лимиты по операциям и документам.
                </p>
              </div>
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cabinet-accent-strong" />
            </div>
            <div className="mt-4">
              <StatusBadge status={summary.kycStatus ?? 'draft'} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <StatusPane
          label="Email"
          value={user.emailVerifiedAt ? 'Адрес подтверждён' : 'Нужно подтвердить адрес'}
          icon={<MailCheck className="h-4 w-4" />}
        />
        <StatusPane
          label="Статус профиля"
          value={summary.kycStatus === 'approved' ? 'Профиль готов к операциям' : 'Профиль требует завершения'}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <StatusPane
          label="Операционный поток"
          value={summary.unreadNotifications > 0 ? 'Есть события для просмотра' : 'Новых событий нет'}
          icon={<WalletCards className="h-4 w-4" />}
        />
      </div>
    </CabinetSurface>
  );
}

function MetricPane({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-cabinet-border/80 bg-cabinet-panel-strong p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">
          {label}
        </p>
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-cabinet-border/75 bg-cabinet-panel-muted text-cabinet-accent-strong">
          {icon}
        </div>
      </div>
      <p className="mt-3 font-mono text-[30px] font-semibold tracking-[-0.05em] text-cabinet-ink">
        {value}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-cabinet-muted-ink text-pretty">{hint}</p>
    </div>
  );
}

function MetricInset({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[14px] border border-white/12 bg-white/6 p-4 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/64">{label}</p>
      <p className="mt-2 font-mono text-[26px] font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/70 text-pretty">{hint}</p>
    </div>
  );
}

function StatusPane({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[14px] border border-cabinet-border/80 bg-cabinet-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">
          {label}
        </p>
        <div className="text-cabinet-accent-strong">{icon}</div>
      </div>
      <p className="mt-3 text-sm font-medium leading-relaxed text-cabinet-ink">{value}</p>
    </div>
  );
}
