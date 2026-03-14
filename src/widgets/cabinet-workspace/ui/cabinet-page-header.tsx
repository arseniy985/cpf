import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/classnames';

type CabinetPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function CabinetPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: CabinetPageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[30px]">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
