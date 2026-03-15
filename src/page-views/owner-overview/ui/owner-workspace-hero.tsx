'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, CircleCheckBig, CircleDashed, FileBadge2, Landmark, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OwnerWorkspace } from '@/entities/owner-account/api/types';
import { formatCompactMoney, formatMoney } from '@/shared/lib/format';
import { StatusBadge } from '@/shared/ui/status-badge';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';

export function OwnerWorkspaceHero({
  workspace,
  onSubmit,
  isSubmitting,
}: {
  workspace: OwnerWorkspace;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}) {
  const completedCount = workspace.onboarding.checklist.filter((item) => item.completed).length;

  return (
    <CabinetSurface
      eyebrow="Профиль компании"
      title={workspace.account.displayName}
      description="Показывает, что уже заполнено, что мешает пройти проверку и куда идти дальше."
      variant="hero"
      action={(
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={workspace.onboarding.status} />
          <Button variant="outline" asChild>
            <Link href="/owner/organization">
              Данные компании
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button onClick={onSubmit} disabled={!workspace.onboarding.canSubmitForReview || isSubmitting}>
            <SendHorizonal className="h-4 w-4" />
            {isSubmitting ? 'Отправляем…' : 'Отправить на проверку'}
          </Button>
        </div>
      )}
      contentClassName="space-y-6"
    >
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[26px] border border-cabinet-border/70 bg-cabinet-panel-strong p-5">
          <div className="flex flex-wrap items-center gap-3">
            <SignalChip icon={CircleCheckBig} label={`${completedCount}/${workspace.onboarding.checklist.length} шагов закрыто`} tone="success" />
            <SignalChip icon={CircleDashed} label={`${workspace.onboarding.progressPercent}% готовности`} tone="warning" />
            <SignalChip icon={FileBadge2} label={`${workspace.summary.reviewQueueCount} проектов в review`} tone="neutral" />
          </div>

          <div
            className="mt-5 overflow-hidden rounded-full bg-cabinet-panel-muted"
            aria-label="Прогресс owner onboarding"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={workspace.onboarding.progressPercent}
          >
            <div
              className="h-3 rounded-full bg-[linear-gradient(90deg,var(--cabinet-accent),#d5a070)] transition-[width] duration-300"
              style={{ width: `${workspace.onboarding.progressPercent}%` }}
            />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {workspace.onboarding.checklist.map((item) => (
              <div
                key={item.key}
                className="rounded-[20px] border border-cabinet-border/65 bg-cabinet-panel px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cabinet-ink">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-cabinet-muted-ink">{item.description}</p>
                  </div>
                  <div
                    className={`mt-0.5 h-3 w-3 rounded-full ${item.completed ? 'bg-cabinet-success' : 'bg-cabinet-warning'}`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <SummaryTile
            label="Цель по проектам"
            value={formatCompactMoney(workspace.summary.totalTargetAmount)}
            hint={`${workspace.summary.projectsCount} объектов в кабинете`}
            icon={<Landmark className="h-4 w-4" />}
          />
          <SummaryTile
            label="Уже собрано"
            value={formatMoney(workspace.summary.totalRaisedAmount)}
            hint={`${workspace.summary.publishedCount} опубликовано`}
            icon={<CircleCheckBig className="h-4 w-4" />}
          />
          <SummaryTile
            label="Следующий фокус"
            value={workspace.onboarding.canSubmitForReview ? 'Проверка профиля' : 'Заполнение профиля'}
            hint={workspace.onboarding.canSubmitForReview ? 'Можно отправлять на проверку' : 'Есть пункты, которые нужно заполнить'}
            icon={<CircleDashed className="h-4 w-4" />}
          />
        </div>
      </div>
    </CabinetSurface>
  );
}

function SummaryTile({
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
    <div className="rounded-[22px] border border-cabinet-border/65 bg-cabinet-panel-strong px-5 py-4 shadow-[0_12px_32px_rgba(31,50,66,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">{label}</p>
          <p className="mt-3 font-mono text-[24px] font-semibold tracking-[-0.04em] text-cabinet-ink">{value}</p>
          <p className="mt-2 text-sm leading-relaxed text-cabinet-muted-ink">{hint}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cabinet-panel-muted text-cabinet-accent-strong">
          {icon}
        </div>
      </div>
    </div>
  );
}

function SignalChip({
  icon: Icon,
  label,
  tone,
}: {
  icon: typeof CircleCheckBig;
  label: string;
  tone: 'success' | 'warning' | 'neutral';
}) {
  const tones = {
    success: 'border-cabinet-success/20 bg-emerald-50 text-cabinet-success',
    warning: 'border-cabinet-warning/20 bg-cabinet-accent-soft text-cabinet-warning',
    neutral: 'border-cabinet-border bg-cabinet-panel text-cabinet-ink',
  } as const;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${tones[tone]}`}>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}
