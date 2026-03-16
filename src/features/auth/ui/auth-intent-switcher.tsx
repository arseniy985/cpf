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
      className="inline-flex rounded-[1.75rem] border border-white/10 bg-[#1d2028]/80 p-1 backdrop-blur-md"
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
            className={`min-w-[10.5rem] rounded-[1.35rem] px-4 py-3 text-left transition-[background-color,color,box-shadow,transform] focus-visible:ring-2 focus-visible:ring-teal-300/70 focus-visible:outline-none ${
              isActive
                ? 'bg-[#f2eee6] text-[#182235] shadow-[0_14px_30px_rgba(15,23,42,0.18)]'
                : 'text-white/72 hover:bg-white/6 hover:text-white'
            }`}
          >
            <span className="block text-sm font-semibold leading-none">{option.label}</span>
            <span className={`mt-1 block text-[11px] leading-tight ${isActive ? 'text-[#5b6473]' : 'text-white/45'}`}>
              {option.caption}
            </span>
          </button>
        );
      })}
    </div>
  );
}
