import { cn } from '@/shared/lib/classnames';
import { getStatusMeta, getStatusToneClasses } from '@/shared/lib/app-cabinet/status';

type AppStatusBadgeProps = {
  status: string | null | undefined;
  className?: string;
};

export function AppStatusBadge({ status, className }: AppStatusBadgeProps) {
  const meta = getStatusMeta(status);

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
        getStatusToneClasses(meta.tone),
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
