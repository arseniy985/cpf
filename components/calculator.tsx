'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Calculator as CalcIcon } from 'lucide-react';

export default function Calculator() {
  const [amount, setAmount] = useState<number>(500000);
  const [months, setMonths] = useState<number>(24);
  const yieldRate = 0.22; // 22% annual

  const totalProfit = Math.round(amount * yieldRate * (months / 12));
  const monthlyProfit = Math.round(totalProfit / months);
  const totalReturn = amount + totalProfit;

  return (
    <section id="calculator" className="py-32 bg-indigo-950 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-teal-400 text-sm font-bold mb-8 border border-white/10 uppercase tracking-wider">
              <CalcIcon className="w-4 h-4" />
              Калькулятор доходности
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6 tracking-tighter leading-[1.1]">
              Рассчитайте свой <br/> <span className="text-teal-400">пассивный доход</span>
            </h2>
            <p className="text-indigo-200 text-lg mb-12 max-w-md leading-relaxed">
              Узнайте, сколько вы сможете заработать, инвестируя в коммерческую недвижимость вместе с нами.
            </p>

            <div className="space-y-10">
              {/* Amount Slider */}
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Сумма инвестиций</label>
                  <span className="text-2xl font-display font-bold text-white">{amount.toLocaleString('ru-RU')} ₽</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-3 bg-indigo-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between mt-3 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <span>10 тыс. ₽</span>
                  <span>10 млн. ₽</span>
                </div>
              </div>

              {/* Months Slider */}
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Срок инвестирования</label>
                  <span className="text-2xl font-display font-bold text-white">{months} мес.</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="6"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full h-3 bg-indigo-900 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between mt-3 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <span>6 мес.</span>
                  <span>5 лет</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-indigo-900/40 backdrop-blur-xl border border-indigo-800 p-8 md:p-12 rounded-[40px] shadow-2xl shadow-indigo-950/50"
          >
            <h3 className="text-xl font-bold text-indigo-300 mb-8 uppercase tracking-wider">Прогноз доходности</h3>
            
            <div className="space-y-6 mb-12">
              <div className="flex justify-between items-end border-b border-indigo-800/50 pb-4">
                <span className="text-indigo-200 font-medium">Вложенная сумма</span>
                <span className="text-2xl font-bold">{amount.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-end border-b border-indigo-800/50 pb-4">
                <span className="text-indigo-200 font-medium">Ежемесячная выплата</span>
                <span className="text-2xl font-bold text-teal-400">+{monthlyProfit.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-end border-b border-indigo-800/50 pb-4">
                <span className="text-indigo-200 font-medium">Чистая прибыль за {months} мес.</span>
                <span className="text-2xl font-bold text-teal-400">+{totalProfit.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-indigo-100 font-bold uppercase tracking-wider">Итого к возврату</span>
                <span className="text-5xl font-display font-black text-white tracking-tighter">{totalReturn.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-modal', { detail: { type: 'invest' } }))}
                className="flex-1 bg-teal-400 text-indigo-950 px-6 py-5 rounded-2xl font-bold hover:bg-teal-500 transition-colors text-center shadow-xl shadow-teal-400/20 text-lg"
              >
                Инвестировать
              </button>
              <button className="flex items-center justify-center gap-2 bg-indigo-800 text-white px-6 py-5 rounded-2xl font-bold hover:bg-indigo-700 transition-colors text-lg">
                <Download className="w-5 h-5" />
                PDF
              </button>
            </div>
            <p className="text-xs text-indigo-400 text-center mt-8 leading-relaxed">
              * Расчет является предварительным и основан на средней исторической доходности платформы (22% годовых). Не является публичной офертой.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
