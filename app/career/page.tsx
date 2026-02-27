'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function CareerPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-24 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 mb-6 tracking-tighter">
              СТАНЬТЕ ЧАСТЬЮ <br/>
              <span className="text-indigo-600">КОМАНДЫ ЦПФ</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Мы ищем амбициозных профессионалов, готовых менять рынок инвестиций и коммерческой недвижимости.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 mb-24">
            <div className="bg-indigo-950 rounded-[40px] p-12 text-white">
              <h2 className="text-3xl font-display font-bold mb-8">Почему мы?</h2>
              <ul className="space-y-6">
                {[
                  'Достойная оплата и прозрачная система бонусов',
                  'Работа с крупными чеками и премиальными клиентами',
                  'Современный офис в Москва-Сити',
                  'Обучение и быстрый карьерный рост'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg">
                    <div className="w-2 h-2 bg-teal-400 rounded-full shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-display font-bold text-indigo-950 mb-6">Открытые вакансии</h2>
              <div className="space-y-4">
                {[
                  { title: 'Бизнес-брокер (Senior)', dept: 'Продажи' },
                  { title: 'Финансовый аналитик', dept: 'Аналитика' },
                  { title: 'Юрист по недвижимости', dept: 'Юридический отдел' }
                ].map((job, i) => (
                  <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between group hover:border-indigo-600 transition-colors cursor-pointer">
                    <div>
                      <h4 className="text-xl font-bold text-indigo-950 mb-1">{job.title}</h4>
                      <span className="text-sm text-slate-500 font-medium uppercase tracking-wider">{job.dept}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
