import type { ReactNode } from 'react';

type AppEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function AppEmptyState({ title, description, action }: AppEmptyStateProps) {
  return (
    <div className="border border-dashed border-app-cabinet-border bg-app-cabinet-secondary/35 px-5 py-6">
      <div className="max-w-xl">
        <h3 className="text-base font-semibold text-app-cabinet-text">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{description}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}
