'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calculator as CalcIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function Calculator() {
  const [amount, setAmount] = useState<number>(300000);
  const [months, setMonths] = useState<number>(18);
  const yieldRate = 0.18;

  const totalProfit = Math.round(amount * yieldRate * (months / 12));
  const monthlyProfit = Math.round(totalProfit / months);
  const totalReturn = amount + totalProfit;

  return (
    <section id="calculator" className="py-32 bg-indigo-950 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-teal-400 text-sm font-bold mb-8 border border-white/10 uppercase tracking-wider">
              <CalcIcon className="w-4 h-4" />
              Калькулятор доходности
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6 tracking-tighter leading-[1.1]">
              Оцените <br/> <span className="text-teal-400">реальный сценарий входа</span>
            </h2>
            <p className="text-indigo-200 text-lg mb-12 max-w-md leading-relaxed">
              На главной показан быстрый ориентир. Полный расчет на отдельной странице уже подтягивает реальные проекты и ведет в существующий инвестиционный флоу.
            </p>

            <div className="space-y-10">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Сумма инвестиций</label>
                  <span className="text-2xl font-display font-bold text-white">{amount.toLocaleString('ru-RU')} ₽</span>
                </div>
                <Slider
                  min={10000}
                  max={3000000}
                  step={10000}
                  value={[amount]}
                  onValueChange={([value]) => setAmount(value ?? amount)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Срок инвестирования</label>
                  <span className="text-2xl font-display font-bold text-white">{months} мес.</span>
                </div>
                <Slider
                  min={6}
                  max={36}
                  step={6}
                  value={[months]}
                  onValueChange={([value]) => setMonths(value ?? months)}
                />
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-indigo-900/40 backdrop-blur-xl border border-indigo-800 p-8 md:p-12 rounded-[40px] shadow-2xl shadow-indigo-950/50"
          >
            <h3 className="text-xl font-bold text-indigo-300 mb-8 uppercase tracking-wider">Быстрый ориентир</h3>

            <div className="space-y-6 mb-12">
              <div className="flex justify-between items-end border-b border-indigo-800/50 pb-4">
                <span className="text-indigo-200 font-medium">Вложенная сумма</span>
                <span className="text-2xl font-bold">{amount.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-end border-b border-indigo-800/50 pb-4">
                <span className="text-indigo-200 font-medium">Ориентир по выплате в месяц</span>
                <span className="text-2xl font-bold text-teal-400">+{monthlyProfit.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-end border-b border-indigo-800/50 pb-4">
                <span className="text-indigo-200 font-medium">Ориентир по доходу за срок</span>
                <span className="text-2xl font-bold text-teal-400">+{totalProfit.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-indigo-100 font-bold uppercase tracking-wider">Итого к возврату</span>
                <span className="text-5xl font-display font-black text-white tracking-tighter">{totalReturn.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1 text-lg" size="lg">
                <Link href="/calculator">
                  Открыть расчет
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild className="text-lg" size="lg" variant="secondary">
                <Link href="/projects">
                  <FileText className="w-5 h-5" />
                  Проекты
                </Link>
              </Button>
            </div>
            <p className="text-xs text-indigo-400 text-center mt-8 leading-relaxed">
              Быстрый расчет нужен для ориентира. Подтверждение участия, документы и платежный сценарий происходят в рабочем кабинете.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
