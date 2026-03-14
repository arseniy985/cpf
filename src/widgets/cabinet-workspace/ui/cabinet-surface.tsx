import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/shared/lib/classnames';

type CabinetSurfaceProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function CabinetSurface({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: CabinetSurfaceProps) {
  return (
    <Card className={cn('rounded-lg border-slate-200 bg-white shadow-sm', className)}>
      <CardHeader className="space-y-2 border-b border-slate-200 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight text-slate-950">{title}</CardTitle>
            {description ? <CardDescription className="mt-1 text-sm text-slate-600">{description}</CardDescription> : null}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>
    </Card>
  );
}
