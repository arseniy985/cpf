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
    <div className={cn('rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center', className)}>
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        <Inbox className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
