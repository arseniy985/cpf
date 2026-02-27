'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { motion } from 'motion/react';
import { Briefcase, Scale, LineChart, Users, ArrowUpRight, ShieldCheck, Building2 } from 'lucide-react';

const services = [
  {
    title: 'Финансовое планирование',
    desc: 'Разработка стратегии инвестирования, подбор портфеля активов под ваши цели и риск-профиль.',
    icon: LineChart,
    colSpan: 'md:col-span-8',
    bg: 'bg-indigo-950 text-white',
    iconBg: 'bg-teal-400 text-indigo-950',
  },
  {
    title: 'Юридическое сопровождение',
    desc: 'Полная проверка объектов (Due Diligence), оформление сделок и защита прав инвесторов.',
    icon: Scale,
    colSpan: 'md:col-span-4',
    bg: 'bg-white border border-slate-200',
    iconBg: 'bg-indigo-100 text-indigo-600',
  },
  {
    title: 'Аналитика и аудит бизнеса',
    desc: 'Глубокий анализ финансовых показателей, оценка стоимости и потенциала роста готового бизнеса.',
    icon: Briefcase,
    colSpan: 'md:col-span-4',
    bg: 'bg-teal-400 text-indigo-950',
    iconBg: 'bg-indigo-950 text-teal-400',
  },
  {
    title: 'Управление активами',
    desc: 'Операционное управление недвижимостью: поиск арендаторов, ремонт, сбор платежей и налоги.',
    icon: Building2,
    colSpan: 'md:col-span-8',
    bg: 'bg-indigo-50 border border-indigo-100',
    iconBg: 'bg-indigo-600 text-white',
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-3xl -z-10"></div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 mb-6 tracking-tighter">
              КОМПЛЕКСНОЕ <br/>
              <span className="text-teal-400">СОПРОВОЖДЕНИЕ</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Мы не просто продаем активы. Мы обеспечиваем полный цикл услуг от аудита до операционного управления.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[320px]">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${service.colSpan} ${service.bg} rounded-[40px] p-10 md:p-12 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-500`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${service.iconBg}`}>
                    <service.icon className="w-10 h-10" />
                  </div>
                  <button className="w-12 h-12 rounded-full border border-current opacity-50 flex items-center justify-center group-hover:opacity-100 group-hover:bg-current group-hover:text-white transition-all">
                    <ArrowUpRight className="w-5 h-5 group-hover:text-teal-400" />
                  </button>
                </div>
                <div>
                  <h3 className="text-3xl font-display font-bold mb-4 leading-tight">{service.title}</h3>
                  <p className="text-lg opacity-80 leading-relaxed max-w-md">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-24 bg-indigo-950 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl"></div>
            <ShieldCheck className="w-20 h-20 text-teal-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Нужно индивидуальное решение?</h2>
            <p className="text-indigo-200 text-xl mb-10 max-w-2xl mx-auto">
              Оставьте заявку, и наши эксперты разработают персональную стратегию под ваши задачи.
            </p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-modal', { detail: { type: 'consult' } }))}
              className="bg-teal-400 text-indigo-950 px-10 py-5 rounded-full font-bold text-lg hover:bg-teal-300 transition-colors shadow-xl shadow-teal-400/20"
            >
              Заказать консультацию
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
