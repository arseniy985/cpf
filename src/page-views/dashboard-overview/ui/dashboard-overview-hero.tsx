import type { ReactNode } from 'react';
import { MailCheck, ShieldCheck, WalletCards } from 'lucide-react';
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
      eyebrow="Сводка по кабинету"
      title="Ваш рабочий контур"
      description="Сначала самое важное: доступные средства, объём портфеля и готовность профиля к операциям."
      variant="hero"
    >
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] bg-cabinet-ink p-6 text-cabinet-panel-strong shadow-[0_18px_44px_rgba(31,50,66,0.22)]">
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cabinet-accent-soft/90">
            <WalletCards className="h-4 w-4" />
            Доступно сейчас
          </div>
          <p className="mt-5 font-mono text-[36px] font-semibold tracking-[-0.05em] sm:text-[44px]">
            {formatMoney(summary.walletBalance)}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/74">
            Эта сумма может пойти на участие в проектах или на вывод, если профиль уже подтверждён.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <MetricInset
              label="Портфель"
              value={formatMoney(summary.portfolioAmount)}
              hint="Подтверждённые и активные участия"
            />
            <MetricInset
              label="На выводе"
              value={formatMoney(summary.pendingWithdrawals)}
              hint="Заявки, ожидающие ручной обработки"
            />
          </div>
        </div>

        <div className="grid gap-3">
          <MetricPane
            label="Заявок в работе"
            value={String(summary.applicationsCount)}
            hint="Черновики, согласование и подтверждение участия"
          />
          <MetricPane
            label="Непрочитанные"
            value={String(summary.unreadNotifications)}
            hint="Изменения по платежам, проверке и сделкам"
          />
          <div className="rounded-[24px] border border-cabinet-border bg-cabinet-panel-strong p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">
                  Проверка профиля
                </p>
                <p className="mt-2 text-sm leading-relaxed text-cabinet-muted-ink">
                  Кошелёк и сделки открываются быстрее, когда профиль полностью подтверждён.
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
          label="Почта"
          value={user.emailVerifiedAt ? 'Подтверждена' : 'Требует подтверждения'}
          icon={<MailCheck className="h-4 w-4" />}
        />
        <StatusPane
          label="Проверка профиля"
          value={summary.kycStatus === 'approved' ? 'Готово к операциям' : 'Есть незавершённые шаги'}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <StatusPane
          label="Рабочий ритм"
          value={summary.unreadNotifications > 0 ? 'Есть новые события' : 'Контур спокоен'}
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
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[24px] border border-cabinet-border bg-cabinet-panel-strong p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">
        {label}
      </p>
      <p className="mt-3 font-mono text-[30px] font-semibold tracking-[-0.05em] text-cabinet-ink">
        {value}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-cabinet-muted-ink">{hint}</p>
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
    <div className="rounded-[22px] border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/64">{label}</p>
      <p className="mt-2 font-mono text-[26px] font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{hint}</p>
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
    <div className="rounded-[22px] border border-cabinet-border/70 bg-cabinet-panel p-4">
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
