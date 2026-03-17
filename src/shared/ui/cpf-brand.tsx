import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { cn } from '@/shared/lib/classnames';

type CPFBrandProps = {
  href?: string;
  className?: string;
  onClick?: () => void;
  theme?: 'light' | 'dark';
};

export function CPFBrand({
  href = '/',
  className,
  onClick,
  theme = 'light',
}: CPFBrandProps) {
  const isDark = theme === 'dark';

  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-3 transition-[transform,opacity] hover:-translate-y-0.5 hover:opacity-95', className)}
      onClick={onClick}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl transition-[background-color,color,transform] duration-300 group-hover:scale-[1.03]',
          isDark
            ? 'bg-indigo-600 text-white group-hover:bg-teal-400 group-hover:text-indigo-950'
            : 'bg-indigo-600 text-white group-hover:bg-indigo-700',
        )}
      >
        <Building2 className="h-7 w-7" aria-hidden="true" />
      </div>

      <div className="flex min-w-0 flex-col">
        <span
          className={cn(
            'font-display text-2xl font-bold leading-none uppercase',
            isDark ? 'tracking-wider text-white' : 'tracking-wider text-indigo-950',
          )}
        >
          ЦПФ
        </span>
        <span
          className={cn(
            'mt-0.5 text-[10px] font-bold uppercase',
            isDark ? 'tracking-[0.3em] text-indigo-400' : 'tracking-[0.3em] text-slate-500',
          )}
        >
          Инвестиции
        </span>
      </div>
    </Link>
  );
}
