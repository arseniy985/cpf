'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { ArrowRight, Download, Info, Wallet } from 'lucide-react';

const scenarios = [
  { id: 'base', name: 'Базовый сценарий', rate: 12 },
  { id: 'balanced', name: 'Сбалансированный сценарий', rate: 16 },
  { id: 'growth', name: 'Сценарий роста', rate: 20 },
];

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}

export default function CalculatorPage() {
  const [amount, setAmount] = useState(100000);
  const [months, setMonths] = useState(24);
  const [scenarioId, setScenarioId] = useState('balanced');

  const scenario = scenarios.find((item) => item.id === scenarioId) || scenarios[1];

  const calculation = useMemo(() => {
    const monthlyRate = scenario.rate / 100 / 12;
    const monthlyIncome = amount * monthlyRate;
    const totalIncome = monthlyIncome * months;
    const totalReturn = amount + totalIncome;

    const schedule = Array.from({ length: Math.min(months, 12) }).map((_, index) => ({
      month: index + 1,
      income: monthlyIncome,
      cumulative: monthlyIncome * (index + 1),
    }));

    return { monthlyIncome, totalIncome, totalReturn, schedule };
  }, [amount, months, scenario.rate]);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-2 bg-teal-400 mb-6"></div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 tracking-tighter leading-[1]">
            КАЛЬКУЛЯТОР <span className="text-indigo-600">ДОХОДНОСТИ</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-3xl leading-relaxed">
            Оцените модель выплат по сумме и сроку участия. Страница показывает демонстрационный расчет для
            предварительной оценки сценария.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[32px] p-8">
            <h2 className="text-2xl font-display font-bold text-indigo-950">Параметры расчета</h2>

            <div className="mt-8 space-y-7">
              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Сумма</label>
                <input
                  type="range"
                  min={10000}
                  max={5000000}
                  step={10000}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                  className="mt-3 w-full accent-teal-500"
                />
                <p className="mt-2 text-2xl font-display font-bold text-indigo-950">{formatCurrency(amount)}</p>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Срок участия</label>
                <input
                  type="range"
                  min={6}
                  max={60}
                  step={6}
                  value={months}
                  onChange={(event) => setMonths(Number(event.target.value))}
                  className="mt-3 w-full accent-teal-500"
                />
                <p className="mt-2 text-2xl font-display font-bold text-indigo-950">{months} мес.</p>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Сценарий</label>
                <div className="mt-3 grid gap-3">
                  {scenarios.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setScenarioId(item.id)}
                      className={`text-left px-4 py-4 rounded-2xl border transition-colors ${
                        item.id === scenarioId
                          ? 'bg-indigo-950 text-white border-indigo-950'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <p className="font-bold">{item.name}</p>
                      <p className={`text-sm mt-1 ${item.id === scenarioId ? 'text-indigo-200' : 'text-slate-500'}`}>
                        Ориентир доходности: {item.rate}% годовых
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <article className="bg-indigo-950 text-white rounded-[32px] p-8">
              <h2 className="text-2xl font-display font-bold">Результат расчета</h2>
              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <div className="bg-indigo-900/60 border border-indigo-800 rounded-2xl p-4">
                  <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Ежемесячно</p>
                  <p className="mt-2 text-2xl font-display font-bold text-teal-400">{formatCurrency(calculation.monthlyIncome)}</p>
                </div>
                <div className="bg-indigo-900/60 border border-indigo-800 rounded-2xl p-4">
                  <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Доход за срок</p>
                  <p className="mt-2 text-2xl font-display font-bold text-teal-400">{formatCurrency(calculation.totalIncome)}</p>
                </div>
                <div className="bg-indigo-900/60 border border-indigo-800 rounded-2xl p-4">
                  <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Итого возврат</p>
                  <p className="mt-2 text-2xl font-display font-bold">{formatCurrency(calculation.totalReturn)}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-teal-400 text-indigo-950 font-bold hover:bg-teal-500 transition-colors">
                  Начать инвестировать <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-indigo-800 text-white font-bold hover:bg-indigo-700 transition-colors">
                  <Download className="w-4 h-4" /> Скачать PDF
                </button>
              </div>
            </article>

            <article className="bg-white border border-slate-200 rounded-[32px] p-8">
              <h3 className="text-2xl font-display font-bold text-indigo-950">Прогноз по месяцам</h3>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs uppercase tracking-widest text-slate-500 border-b border-slate-200">
                      <th className="pb-3 font-bold">Месяц</th>
                      <th className="pb-3 font-bold">Выплата</th>
                      <th className="pb-3 font-bold">Накопленный доход</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculation.schedule.map((item) => (
                      <tr key={item.month} className="border-b border-slate-100">
                        <td className="py-3 font-medium text-slate-700">{item.month}</td>
                        <td className="py-3 font-bold text-indigo-700">{formatCurrency(item.income)}</td>
                        <td className="py-3 font-medium text-slate-700">{formatCurrency(item.cumulative)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="bg-slate-100 border border-slate-200 rounded-[28px] p-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
              <p className="text-sm text-slate-600 leading-relaxed">
                Расчет носит информационный характер и не является офертой или индивидуальной инвестиционной рекомендацией.
                Фактические условия фиксируются в документах конкретного проекта.
              </p>
            </article>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-3">
              <Wallet className="w-6 h-6 text-indigo-600 mt-1" />
              <div>
                <h4 className="text-xl font-display font-bold text-indigo-950">Нужен расчет под конкретный проект?</h4>
                <p className="mt-1 text-slate-600">Подготовим персональный сценарий по выбранному объекту и сроку.</p>
              </div>
            </div>
            <Link href="/contacts" className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-indigo-950 text-white font-bold hover:bg-indigo-800 transition-colors">
              Получить консультацию <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
