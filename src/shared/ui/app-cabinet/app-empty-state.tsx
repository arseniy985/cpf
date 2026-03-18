import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type AppEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: LucideIcon;
};

export function AppEmptyState({ title, description, action, icon: Icon }: AppEmptyStateProps) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-[#E2E8F0] bg-transparent shadow-none">
      <div className="flex flex-col items-center justify-center p-12 text-center">
        {Icon ? (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary">
            <Icon className="h-6 w-6 text-brand-primary" aria-hidden="true" />
          </div>
        ) : null}
        <h3 className="mb-2 text-lg font-semibold text-brand-text">{title}</h3>
        <p className="mb-6 max-w-md text-sm text-brand-text-muted">{description}</p>
        {action ? <div>{action}</div> : null}
      </div>
    </div>
  );
}
