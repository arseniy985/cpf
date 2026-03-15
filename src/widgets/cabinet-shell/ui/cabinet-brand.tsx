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
      className={cn('flex items-center gap-3 rounded-2xl px-1 py-1.5 transition-[transform,opacity] hover:-translate-y-0.5 hover:opacity-90', className)}
      onClick={onClick}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cabinet-ink text-cabinet-panel-strong shadow-[0_12px_30px_rgba(31,50,66,0.16)]">
        <Building2 className="h-5 w-5" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="font-display text-2xl font-bold uppercase leading-none tracking-[0.16em] text-cabinet-ink">
          ЦПФ
        </span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cabinet-accent-strong">
          Investor Desk
        </span>
      </div>
    </Link>
  );
}
