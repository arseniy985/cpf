'use client';

import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, TrendingUp, Building2, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-slate-50"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-teal-400/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 text-teal-700 text-sm font-bold mb-6 border border-teal-400/30 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Лидеры рынка с 2014 года
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-indigo-950 leading-[1.1] tracking-tighter mb-6">
              Покупка и продажа <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                готового бизнеса
              </span> <br/>
              и недвижимости
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed font-medium">
              Коллективные инвестиции в проверенные коммерческие объекты. Просто, безопасно, с ежемесячными выплатами от 10 000 ₽.
            </p>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-600 leading-tight">Бизнесы от собственников</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-600 leading-tight">Работающие с прибылью</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-600 leading-tight">Купите проверенный бизнес</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-600 leading-tight">Лучшие условия для покупки</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/projects"
                className="inline-flex items-center justify-center gap-2 bg-teal-400 text-indigo-950 px-8 py-4 rounded-full font-bold hover:bg-teal-500 transition-all shadow-xl shadow-teal-400/20 group"
              >
                Смотреть проекты
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/about"
                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-950 border-2 border-slate-200 px-8 py-4 rounded-full font-bold hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                О компании
              </Link>
            </div>
          </motion.div>

          {/* Consultation Form Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative mt-12 lg:mt-0"
          >
            <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-indigo-900/10 border border-slate-200 relative z-10">
              <h3 className="text-2xl font-display font-bold text-indigo-950 mb-2">
                Получите <span className="text-teal-500">бесплатную</span> консультацию наших экспертов
              </h3>
              <p className="text-sm text-slate-500 mb-8 font-medium">
                Оставьте заявку, и мы подберем для вас лучшие инвестиционные предложения.
              </p>

              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Ваше имя</label>
                  <input 
                    type="text" 
                    placeholder="Иван Иванов"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">Номер телефона</label>
                  <input 
                    type="tel" 
                    placeholder="+7 (___) ___-__-__"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                  />
                </div>
                
                <button 
                  type="button"
                  className="w-full bg-indigo-950 text-white font-bold py-4 rounded-2xl hover:bg-indigo-800 transition-colors mt-2 shadow-xl shadow-indigo-950/20"
                >
                  Отправить заявку
                </button>

                <div className="flex items-start gap-2 mt-4">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-tight">
                    Нажимая на кнопку, вы даете согласие на обработку <a href="#" className="underline hover:text-indigo-600">персональных данных</a>
                  </p>
                </div>
              </form>
            </div>

            {/* Decorative background shape for the form */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-600/20 rounded-full blur-2xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
