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
    <div className={cn('rounded-3xl border border-slate-100 bg-brand-surface text-brand-text shadow-lg shadow-slate-200/40', classNameByTone(tone))}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-medium text-brand-text-muted">{label}</p>
            <h2 className="text-2xl font-bold tracking-tight text-brand-text">{value}</h2>
            {hint ? <p className="mt-1 text-xs text-brand-text-muted">{hint}</p> : null}
          </div>
          {Icon ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-brand-primary">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function classNameByTone(tone: AppKpiCardProps['tone']) {
  if (tone === 'accent') {
    return 'border-brand-accent/20';
  }

  if (tone === 'success') {
    return 'border-brand-success/15';
  }

  if (tone === 'warning') {
    return 'border-brand-warning/20';
  }

  return '';
}
