'use client';

import { motion } from 'motion/react';
import { Wallet, CalendarDays, FileCheck, Building } from 'lucide-react';

export default function Features() {
  return (
    <section id="about" className="py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 max-w-3xl">
          <div className="w-20 h-2 bg-indigo-600 mb-8"></div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-indigo-950 mb-6 leading-[1.1] tracking-tight">
            Инвестируйте как <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              профессионал
            </span>
          </h2>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            Без лишних сложностей. Мы объединяем капиталы для покупки высокодоходной недвижимости и готового бизнеса.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
          {/* Large Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-8 md:row-span-2 bg-indigo-950 rounded-[40px] p-10 md:p-16 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(125,211,252,0.22),transparent_22%),radial-gradient(circle_at_18%_78%,rgba(255,255,255,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute inset-y-16 right-14 hidden w-72 rounded-[32px] border border-white/12 bg-white/6 p-6 md:block">
              <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-indigo-200">
                <span>Денежный поток</span>
                <span>Ежемесячно</span>
              </div>
              <div className="space-y-4">
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[72%] rounded-full bg-teal-300"></div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs text-indigo-100">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="mb-1 text-indigo-300">Аренда</div>
                    <div className="text-lg font-bold text-white">81%</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="mb-1 text-indigo-300">Расходы</div>
                    <div className="text-lg font-bold text-white">12%</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="mb-1 text-indigo-300">Чистый доход</div>
                    <div className="text-lg font-bold text-white">69%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/80 to-transparent"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-16 md:w-20 aspect-square bg-teal-400 rounded-2xl md:rounded-3xl flex items-center justify-center text-indigo-950 shadow-2xl shadow-teal-400/20 shrink-0">
                <Building className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div className="mt-auto">
                <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">Управление <br/>под ключ</h3>
                <p className="text-indigo-200 text-lg md:text-xl max-w-lg leading-relaxed">Поиск арендаторов, ремонт, налоги и обслуживание — всё это берет на себя наша профессиональная управляющая компания. Вы только получаете доход.</p>
              </div>
            </div>
          </motion.div>

          {/* Tall Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="md:col-span-4 md:row-span-2 bg-teal-400 rounded-[40px] p-10 flex flex-col justify-between group shadow-xl shadow-teal-400/10"
          >
            <div className="w-16 aspect-square bg-indigo-950 rounded-2xl flex items-center justify-center text-teal-400 shadow-lg shrink-0">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-display font-bold text-indigo-950 mb-4 leading-tight">Доступный<br/>вход</h3>
              <p className="text-indigo-900/80 font-medium text-lg leading-relaxed">Начните инвестировать с суммы от 10 000 ₽. Крупные объекты теперь доступны каждому.</p>
            </div>
          </motion.div>

          {/* Wide Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="md:col-span-6 bg-white border border-slate-200 rounded-[40px] p-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 group hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all"
          >
            <div className="w-16 md:w-20 aspect-square bg-blue-50 rounded-2xl md:rounded-full flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform duration-500">
              <CalendarDays className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-indigo-950 mb-3">Регулярные выплаты</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Пассивный доход каждый месяц прямо на вашу банковскую карту.</p>
            </div>
          </motion.div>

          {/* Wide Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="md:col-span-6 bg-indigo-50 rounded-[40px] p-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 group hover:bg-indigo-100 transition-colors"
          >
            <div className="w-16 md:w-20 aspect-square bg-indigo-600 rounded-2xl md:rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500">
              <FileCheck className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-indigo-950 mb-3">Прозрачные документы</h3>
              <p className="text-slate-600 text-lg leading-relaxed">Официальное оформление сделок с полной юридической защитой.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
