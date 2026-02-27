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
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://picsum.photos/seed/arch/800/800')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/80 to-transparent"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-20 h-20 bg-teal-400 rounded-3xl flex items-center justify-center text-indigo-950 shadow-2xl shadow-teal-400/20">
                <Building className="w-10 h-10" />
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
            <div className="w-16 h-16 bg-indigo-950 rounded-full flex items-center justify-center text-teal-400 shadow-lg">
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
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform duration-500">
              <CalendarDays className="w-10 h-10" />
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
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform duration-500">
              <FileCheck className="w-10 h-10" />
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
