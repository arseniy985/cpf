import { BarChart3, Building2, FileCheck2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AuthMode } from '@/features/auth/model/auth-flow';

const authBenefits = [
  {
    icon: Building2,
    title: 'Проверенные проекты',
    text: 'В одном кабинете доступны карточки, документы и история ваших заявок.',
  },
  {
    icon: FileCheck2,
    title: 'Документы без хаоса',
    text: 'После входа можно загрузить KYC, смотреть статусы и получать комментарии менеджера.',
  },
  {
    icon: BarChart3,
    title: 'Портфель и выплаты',
    text: 'Кабинет показывает инвестиции, транзакции, кошелек и этапы по каждому проекту.',
  },
];

export function AuthPromoPanel({
  mode,
  subtitle,
}: {
  mode: AuthMode;
  subtitle: string;
}) {
  return (
    <div className="rounded-[32px] bg-indigo-950 p-8 text-white shadow-2xl shadow-indigo-950/10 md:p-12">
      <Badge className="border-teal-400/30 bg-teal-400/15 text-teal-100">Личный кабинет ЦПФ</Badge>
      <h1 className="mt-6 text-4xl font-display font-black leading-tight md:text-6xl">
        {mode === 'register'
          ? 'Откройте доступ к сделкам, документам и портфелю.'
          : 'Вернитесь в кабинет и продолжите работу с проектами.'}
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-indigo-100 md:text-lg">
        {subtitle}
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {authBenefits.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-indigo-800 bg-indigo-900/60 p-5"
          >
            <item.icon className="h-6 w-6 text-teal-300" />
            <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-indigo-200">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
