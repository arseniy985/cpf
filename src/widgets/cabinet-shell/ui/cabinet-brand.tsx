'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { cn } from '@/shared/lib/classnames';

type CabinetBrandProps = {
  className?: string;
  onClick?: () => void;
};

export function CabinetBrand({ className, onClick }: CabinetBrandProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-3 rounded-lg px-1 py-1.5 transition-opacity hover:opacity-90', className)}
      onClick={onClick}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 text-white">
        <Building2 className="h-6 w-6" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="font-display text-2xl font-bold uppercase leading-none tracking-wider text-indigo-950">
          ЦПФ
        </span>
        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
          Инвестиции
        </span>
      </div>
    </Link>
  );
}
