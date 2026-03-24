import { BarChart3, Building2, FileCheck2, Landmark, ShieldCheck, WalletCards } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AuthIntent, AuthMode } from '@/features/auth/model/auth-flow';

const authBenefits = {
  investor: [
    {
      icon: Building2,
      title: 'Проверенные сделки',
      text: 'В одном кабинете собираются карточки проектов, документы и история ваших заявок.',
    },
    {
      icon: FileCheck2,
      title: 'Проверка профиля без путаницы',
      text: 'Паспорт, статусы проверки и комментарии менеджера собраны в одном понятном разделе.',
    },
    {
      icon: WalletCards,
      title: 'Портфель и выплаты',
      text: 'Баланс, подтверждённые участия и будущие выплаты видны сразу.',
    },
  ],
  owner: [
    {
      icon: ShieldCheck,
      title: 'Профиль компании',
      text: 'Сразу после входа доступны профиль компании, реквизиты и этапы проверки.',
    },
    {
      icon: Landmark,
      title: 'Раунды без ручной координации',
      text: 'Проекты, этапы размещения, заявки инвесторов и выплаты собраны в одном рабочем кабинете.',
    },
    {
      icon: BarChart3,
      title: 'Структурированный запуск',
      text: 'Черновик объекта можно подготовить заранее, а после одобрения быстро открыть сбор.',
    },
  ],
} as const;

export function AuthPromoPanel({
  mode,
  intent,
  subtitle,
}: {
  mode: AuthMode;
  intent: AuthIntent;
  subtitle: string;
}) {
  const isOwner = intent === 'owner';
  const benefits = authBenefits[intent];

  return (
    <div className={`relative overflow-hidden rounded-[36px] border p-8 shadow-[0_24px_90px_rgba(15,23,42,0.16)] md:p-12 ${
      isOwner
        ? 'border-[#b96a3f]/18 bg-[#1f120d] text-white'
        : 'border-[#113660]/16 bg-[#0e203d] text-white'
    }`}>
      <div className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_52%)] ${isOwner ? 'opacity-80' : 'opacity-100'}`} />
      <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-white/10" />
      <Badge className={isOwner ? 'border-[#f7d5c1]/20 bg-[#f7d5c1]/10 text-[#ffe7d7]' : 'border-teal-400/30 bg-teal-400/15 text-teal-100'}>
        {isOwner ? 'Кабинет владельца' : 'Кабинет инвестора'}
      </Badge>
      <h1 className="mt-6 text-4xl font-display font-black leading-tight text-balance md:text-6xl">
        {mode === 'register'
          ? isOwner
            ? 'Запускайте объекты через собственный рабочий контур.'
            : 'Откройте доступ к сделкам, документам и портфелю.'
          : isOwner
            ? 'Вернитесь в кабинет владельца и продолжите подготовку размещения.'
            : 'Вернитесь в кабинет и продолжите работу с проектами.'}
      </h1>
      <p className={`mt-6 max-w-xl text-base leading-relaxed md:text-lg ${isOwner ? 'text-[#f2d6c8]' : 'text-indigo-100'}`}>
        {subtitle}
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {benefits.map((item) => (
          <div
            key={item.title}
            className={`rounded-[28px] border p-5 ${
              isOwner
                ? 'border-white/8 bg-white/5'
                : 'border-indigo-800 bg-indigo-900/60'
            }`}
          >
            <item.icon className={`h-6 w-6 ${isOwner ? 'text-[#ffb38b]' : 'text-teal-300'}`} />
            <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
            <p className={`mt-2 text-sm leading-relaxed ${isOwner ? 'text-[#edd4c8]' : 'text-indigo-200'}`}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
