'use client';

import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const tariffs = [
  {
    name: 'Надёжный',
    description: 'Идеально для старта и знакомства с платформой',
    minAmount: '10 000 ₽',
    yield: 'до 18%',
    risk: 'Низкий',
    features: [
      'Доступ к базовым проектам',
      'Ежеквартальные выплаты',
      'Базовая аналитика',
      'Поддержка в рабочее время',
    ],
    popular: false,
  },
  {
    name: 'Сбалансированный',
    description: 'Оптимальное соотношение риска и высокой доходности',
    minAmount: '300 000 ₽',
    yield: 'до 22%',
    risk: 'Средний',
    features: [
      'Доступ ко всем проектам',
      'Ежемесячные выплаты',
      'Расширенная аналитика',
      'Приоритетная поддержка',
      'Автоинвестирование',
    ],
    popular: true,
  },
  {
    name: 'Повышенный доход',
    description: 'Для опытных инвесторов с крупным капиталом',
    minAmount: '1 500 000 ₽',
    yield: 'до 28%',
    risk: 'Выше среднего',
    features: [
      'Закрытые pre-sale проекты',
      'Индивидуальный график выплат',
      'Персональный менеджер',
      'Участие в совете директоров',
      'Юридический консалтинг',
    ],
    popular: false,
  },
];

export default function Tariffs() {
  return (
    <section id="tariffs" className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="w-20 h-2 bg-indigo-600 mx-auto mb-8"></div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-indigo-950 mb-6 tracking-tighter">
            ТАРИФЫ И УЧАСТИЕ
          </h2>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            Выберите подходящий формат инвестирования в зависимости от ваших целей и капитала.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tariffs.map((tariff, index) => (
            <motion.div
              key={tariff.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-[40px] p-10 border ${
                tariff.popular ? 'border-teal-400 shadow-2xl shadow-teal-400/10 scale-105 z-10' : 'border-slate-200 shadow-sm'
              } flex flex-col`}
            >
              {tariff.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal-400 text-indigo-950 px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase shadow-lg shadow-teal-400/20">
                  Выбор инвесторов
                </div>
              )}
              
              <div className="mb-8 text-center">
                <h3 className="text-3xl font-display font-bold text-indigo-950 mb-3">{tariff.name}</h3>
                <p className="text-slate-500 text-sm h-10 font-medium">{tariff.description}</p>
              </div>

              <div className="mb-10 p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                <div className="mb-6">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">От</p>
                  <p className="text-4xl font-display font-black text-indigo-950">{tariff.minAmount}</p>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Доходность</p>
                    <p className="font-black text-indigo-600 text-lg">{tariff.yield}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Риск</p>
                    <p className="font-bold text-indigo-950 text-lg">{tariff.risk}</p>
                  </div>
                </div>
              </div>

              <ul className="space-y-5 mb-10 flex-1">
                {tariff.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-slate-600 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-modal', { detail: { type: 'invest' } }))}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all ${
                  tariff.popular 
                    ? 'bg-teal-400 text-indigo-950 hover:bg-teal-500 shadow-xl shadow-teal-400/20' 
                    : 'bg-indigo-950 text-white hover:bg-indigo-800'
                }`}
              >
                Выбрать тариф
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
