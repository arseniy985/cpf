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
        'inline-flex items-center border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]',
        getStatusToneClasses(meta.tone),
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
