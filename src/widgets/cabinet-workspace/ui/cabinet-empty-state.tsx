import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/shared/lib/classnames';

type CabinetEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function CabinetEmptyState({
  title,
  description,
  action,
  className,
}: CabinetEmptyStateProps) {
  return (
    <div className={cn('rounded-[24px] border border-dashed border-cabinet-border bg-cabinet-panel px-5 py-10 text-center', className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cabinet-panel-strong text-cabinet-accent-strong shadow-[0_12px_30px_rgba(31,50,66,0.06)]">
        <Inbox className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-cabinet-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-cabinet-muted-ink">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
