'use client';

import type { AuthIntent } from '@/features/auth/model/auth-flow';

type AuthIntentSwitcherProps = {
  value: AuthIntent;
  onChange: (value: AuthIntent) => void;
};

const options: Array<{ value: AuthIntent; label: string; caption: string }> = [
  {
    value: 'investor',
    label: 'Инвестор',
    caption: 'Проекты, документы и выплаты',
  },
  {
    value: 'owner',
    label: 'Владелец',
    caption: 'Компания, объект и отчеты',
  },
];

export function AuthIntentSwitcher({ value, onChange }: AuthIntentSwitcherProps) {
  return (
    <div
      className="inline-flex rounded-[1.5rem] border border-white/70 bg-white/80 p-1 shadow-[0_18px_40px_rgba(21,36,73,0.08)] backdrop-blur-xl"
      role="tablist"
      aria-label="Сценарий регистрации"
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`min-w-[9.75rem] rounded-[1.2rem] px-4 py-3 text-left transition-[background-color,color,box-shadow,transform] focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none ${
              isActive
                ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(227,242,255,0.92))] text-indigo-950 shadow-[0_14px_28px_rgba(33,88,216,0.14)]'
                : 'text-slate-500 hover:bg-slate-100/80 hover:text-indigo-950'
            }`}
          >
            <span className="block text-sm font-semibold leading-none">{option.label}</span>
            <span className={`mt-1 block text-[11px] leading-tight ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
              {option.caption}
            </span>
          </button>
        );
      })}
    </div>
  );
}
