import type { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/classnames';

type AppKpiCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: 'default' | 'accent' | 'success' | 'warning';
};

export function AppKpiCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'default',
}: AppKpiCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-4 sm:px-5 sm:py-5',
        tone === 'accent'
          ? 'border-app-cabinet-accent/30 bg-app-cabinet-secondary'
          : tone === 'success'
            ? 'border-app-cabinet-success/20 bg-app-cabinet-success/5'
            : tone === 'warning'
              ? 'border-app-cabinet-warning/20 bg-app-cabinet-warning/5'
              : 'border-app-cabinet-border bg-app-cabinet-surface',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-cabinet-muted">
            {label}
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-app-cabinet-text sm:text-3xl">
            {value}
          </p>
          {hint ? <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-app-cabinet-border bg-app-cabinet-surface text-app-cabinet-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
