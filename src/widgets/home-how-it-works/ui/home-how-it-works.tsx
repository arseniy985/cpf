'use client';

import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import { Search, CreditCard, Key, LineChart } from 'lucide-react';

const steps = [
  { id: '01', name: 'Выбираете проект', desc: 'Изучите каталог проверенных объектов с подробной аналитикой и финансовой моделью. Мы предоставляем полный Due Diligence по каждому активу.', icon: Search },
  { id: '02', name: 'Инвестируете', desc: 'Оплатите долю картой или по реквизитам. Документы формируются автоматически, и вы сразу получаете юридическое подтверждение сделки.', icon: CreditCard },
  { id: '03', name: 'Мы управляем', desc: 'Наша УК занимается поиском арендаторов, ремонтом и операционным управлением. Вы не тратите свое время на рутину.', icon: Key },
  { id: '04', name: 'Получаете доход', desc: 'Ежемесячный доход поступает на ваш счет. Следите за отчетами в личном кабинете и реинвестируйте для сложного процента.', icon: LineChart },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section id="how-it-works" ref={containerRef} className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sticky Left Side */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <div className="w-20 h-2 bg-teal-400 mb-8"></div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-indigo-950 mb-6 leading-[1.1] tracking-tight">
              Путь к вашему <br/>
              <span className="text-teal-400">капиталу</span>
            </h2>
            <p className="text-xl text-slate-600 mb-12 max-w-md leading-relaxed">
              Прозрачный процесс от первого клика до первой выплаты. Инвестиции стали такими же простыми, как онлайн-шопинг.
            </p>
            
            {/* Progress Visualizer */}
            <div className="hidden lg:block relative h-[400px] w-full bg-indigo-950 rounded-[40px] border border-indigo-900 overflow-hidden shadow-2xl shadow-indigo-900/20">
              <motion.div 
                className="absolute inset-0 bg-teal-400 origin-bottom"
                style={{ scaleY: scrollYProgress }}
              />
              <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
                <span className="font-display text-8xl font-black text-white/20 tracking-tighter">ЦПФ</span>
              </div>
            </div>
          </div>

          {/* Scrolling Right Side */}
          <div className="lg:col-span-7 space-y-24 py-12 lg:py-32">
            {steps.map((step, i) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-20% 0px -20% 0px" }}
                transition={{ duration: 0.5 }}
                className="relative pl-12 md:pl-0 group"
              >
                <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-slate-200">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-400"></div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="shrink-0 text-7xl md:text-8xl font-display font-black text-slate-100 leading-none -mt-4 md:-mt-8 group-hover:text-teal-100 transition-colors duration-500">
                    {step.id}
                  </div>
                  <div className="relative z-10 -mt-6 md:mt-0">
                    <div className="w-16 h-16 bg-white shadow-xl shadow-indigo-900/5 border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white group-hover:-translate-y-2 transition-all duration-300">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-display font-bold text-indigo-950 mb-4">{step.name}</h3>
                    <p className="text-lg text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
