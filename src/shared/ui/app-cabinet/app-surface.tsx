import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/classnames';

type AppSurfaceProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'secondary' | 'dark';
};

export function AppSurface({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  tone = 'default',
}: AppSurfaceProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border bg-brand-surface px-6 py-6 text-brand-text shadow-lg shadow-slate-200/40',
        tone === 'dark'
          ? 'border-brand-primary bg-brand-primary text-white'
          : tone === 'secondary'
            ? 'border-transparent bg-brand-secondary/30 shadow-none'
            : 'border-slate-100',
        className,
      )}
    >
      <div className={cn(
        'flex flex-col gap-4 border-b pb-4 md:flex-row md:items-start md:justify-between',
        tone === 'dark' ? 'border-white/10' : 'border-[#E2E8F0]',
      )}>
        <div className="min-w-0">
          {eyebrow ? (
            <p className={cn('text-xs font-semibold uppercase tracking-wider', tone === 'dark' ? 'text-white/70' : 'text-brand-text-muted')}>
              {eyebrow}
            </p>
          ) : null}
          <h2 className={cn('mt-2 text-lg font-semibold leading-none tracking-tight', tone === 'dark' ? 'text-white' : 'text-brand-text')}>
            {title}
          </h2>
          {description ? (
            <p className={cn('mt-2 max-w-3xl text-sm leading-6', tone === 'dark' ? 'text-white/72' : 'text-brand-text-muted')}>
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}
