import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import Link from 'next/link';
import { ArrowRight, Check, ShieldCheck } from 'lucide-react';

const tariffs = [
  {
    name: 'Надежный',
    min: '[Мин. сумма]',
    risk: 'Низкий',
    target: 'Консервативный вход',
    payout: 'Регламентные выплаты',
    support: 'Базовая поддержка',
    control: 'Стандартный отчет',
  },
  {
    name: 'Сбалансированный',
    min: '[Мин. сумма]',
    risk: 'Средний',
    target: 'Баланс дохода и риска',
    payout: 'Расширенный график выплат',
    support: 'Приоритетная поддержка',
    control: 'Расширенная отчетность',
  },
  {
    name: 'Повышенный доход',
    min: '[Мин. сумма]',
    risk: 'Повышенный',
    target: 'Агрессивный рост',
    payout: 'Индивидуальный график',
    support: 'Персональный менеджер',
    control: 'Индивидуальный контроль',
  },
];

const checklist = [
  'Порог входа и ликвидность участия',
  'Порядок и периодичность выплат',
  'Уровень риска и сценарии просадки',
  'Формат отчетности и доступа к данным',
  'Объем сопровождения со стороны ЦПФ',
];

export default function TariffsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-2 bg-teal-400 mb-6"></div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 tracking-tighter leading-[1]">
            ТАРИФЫ И <span className="text-indigo-600">УЧАСТИЕ</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-3xl leading-relaxed">
            Тариф определяет только рамку участия. Условия финальной сделки всегда зависят от выбранного проекта и
            фиксируются в документах.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid lg:grid-cols-3 gap-6">
            {tariffs.map((tariff, index) => (
              <article
                key={tariff.name}
                className={`rounded-[32px] p-8 border ${
                  index === 1 ? 'bg-indigo-950 text-white border-indigo-900 shadow-2xl shadow-indigo-900/20' : 'bg-white text-slate-900 border-slate-200'
                }`}
              >
                <h2 className="text-3xl font-display font-bold">{tariff.name}</h2>
                <p className={`mt-2 ${index === 1 ? 'text-indigo-200' : 'text-slate-500'}`}>Подходит для стратегии: {tariff.target}</p>

                <div className={`mt-6 p-4 rounded-2xl ${index === 1 ? 'bg-indigo-900/60 border border-indigo-800' : 'bg-slate-50 border border-slate-100'}`}>
                  <p className={`text-xs uppercase tracking-widest font-bold ${index === 1 ? 'text-indigo-300' : 'text-slate-500'}`}>Порог входа</p>
                  <p className="mt-2 text-2xl font-display font-bold">{tariff.min}</p>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <p><span className="font-bold">Риск:</span> {tariff.risk}</p>
                  <p><span className="font-bold">Выплаты:</span> {tariff.payout}</p>
                  <p><span className="font-bold">Поддержка:</span> {tariff.support}</p>
                  <p><span className="font-bold">Контроль:</span> {tariff.control}</p>
                </div>

                <Link
                  href="/contacts"
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-colors ${
                    index === 1 ? 'bg-teal-400 text-indigo-950 hover:bg-teal-500' : 'bg-indigo-950 text-white hover:bg-indigo-800'
                  }`}
                >
                  Обсудить условия <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-12 gap-8">
          <article className="lg:col-span-7 bg-white border border-slate-200 rounded-[32px] p-8">
            <h3 className="text-3xl font-display font-bold text-indigo-950">Сравнительная матрица участия</h3>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-widest text-slate-500 border-b border-slate-200">
                    <th className="pb-3 font-bold">Параметр</th>
                    <th className="pb-3 font-bold">Надежный</th>
                    <th className="pb-3 font-bold">Сбалансированный</th>
                    <th className="pb-3 font-bold">Повышенный</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Отчетность', 'Базовая', 'Расширенная', 'Индивидуальная'],
                    ['Формат сопровождения', 'Стандарт', 'Приоритет', 'Персональный'],
                    ['Гибкость графика', 'Низкая', 'Средняя', 'Высокая'],
                    ['Сложность стратегии', 'Низкая', 'Средняя', 'Высокая'],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-slate-100">
                      <td className="py-3 font-medium text-slate-700">{row[0]}</td>
                      <td className="py-3 text-slate-600">{row[1]}</td>
                      <td className="py-3 text-slate-600">{row[2]}</td>
                      <td className="py-3 text-slate-600">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="lg:col-span-5 bg-indigo-950 text-white rounded-[32px] p-8">
            <h3 className="text-2xl font-display font-bold">Перед выбором тарифа проверьте</h3>
            <div className="mt-6 space-y-3">
              {checklist.map((item) => (
                <div key={item} className="flex items-start gap-3 bg-indigo-900/60 border border-indigo-800 rounded-2xl p-4">
                  <Check className="w-5 h-5 text-teal-400 mt-0.5" />
                  <span className="text-indigo-200">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 p-4 rounded-2xl bg-indigo-900/60 border border-indigo-800 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-400 mt-0.5" />
              <p className="text-sm text-indigo-200 leading-relaxed">
                Итоговые параметры подтверждаются в документах выбранного проекта и согласуются до входа в сделку.
              </p>
            </div>
          </article>
        </section>
      </div>
      <Footer />
    </main>
  );
}
