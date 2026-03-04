'use client';

import { useRef } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { motion, useScroll } from 'motion/react';
import { ArrowRight, CheckCircle2, ClipboardCheck, FileSearch, ShieldCheck, WalletCards } from 'lucide-react';
import Link from 'next/link';

type StoryStep = {
  id: string;
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
};

const steps: StoryStep[] = [
  {
    id: '01',
    title: 'Стартовый бриф и цель',
    text: 'Определяем ваш горизонт, ограничения и формат участия: фиксируем, какой сценарий считается успешным именно для вас.',
    icon: WalletCards,
  },
  {
    id: '02',
    title: 'Подбор релевантных активов',
    text: 'Формируем короткий лист вариантов и объясняем, почему каждый из них подходит под заданную стратегию.',
    icon: FileSearch,
  },
  {
    id: '03',
    title: 'Проверка рисков и сценариев',
    text: 'Проводим проверку по коммерческому, юридическому и операционному контуру с фиксацией критичных точек.',
    icon: ShieldCheck,
  },
  {
    id: '04',
    title: 'Структурирование сделки',
    text: 'Собираем и согласовываем условия участия: роли сторон, календарь выплат, контроль и регламент взаимодействия.',
    icon: ClipboardCheck,
  },
  {
    id: '05',
    title: 'Вход и активация кабинета',
    text: 'После подписания документов фиксируем участие и открываем мониторинг проекта в личном кабинете.',
    icon: CheckCircle2,
  },
  {
    id: '06',
    title: 'Сопровождение и отчеты',
    text: 'Вы регулярно получаете статусы по проекту, отчеты по исполнению и рекомендации по дальнейшим шагам.',
    icon: CheckCircle2,
  },
];

export default function HowPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 pt-12 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="w-16 h-2 bg-teal-400 mb-6" />
            <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 tracking-tighter leading-[1]">
              КАК МЫ ВЕДЁМ
              <br />
              <span className="text-teal-500">ШАГ ЗА ШАГОМ</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-3xl leading-relaxed">
              Сторителлинг процесса собран в один понятный маршрут: на каждом этапе видно цель, действие и ожидаемый результат.
            </p>
          </motion.div>
        </section>

        <section ref={containerRef} className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <aside className="lg:col-span-5 lg:sticky lg:top-44 h-fit">
              <div className="w-20 h-2 bg-teal-400 mb-8" />
              <h2 className="text-5xl md:text-6xl font-display font-bold text-indigo-950 mb-6 leading-[1.05] tracking-tight">
                Путь к вашему
                <br />
                <span className="text-teal-500">капиталу</span>
              </h2>
              <p className="text-xl text-slate-600 mb-10 max-w-md leading-relaxed">
                Без «чёрного ящика»: вы понимаете, что происходит сейчас, что будет дальше и какой артефакт фиксируется по итогу шага.
              </p>

              <div className="hidden lg:block relative h-[360px] w-full bg-indigo-950 rounded-3xl border border-indigo-900 overflow-hidden shadow-2xl shadow-indigo-900/20">
                <motion.div className="absolute inset-0 bg-teal-400 origin-bottom" style={{ scaleY: scrollYProgress }} />
                <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
                  <span className="font-display text-8xl font-black text-white/20 tracking-tighter">ЦПФ</span>
                </div>
              </div>
            </aside>

            <ol className="lg:col-span-7 space-y-20 py-6 lg:py-24">
              {steps.map((step) => (
                <motion.li
                  key={step.id}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ margin: '-20% 0px -20% 0px', once: true }}
                  transition={{ duration: 0.45 }}
                  className="relative pl-10 md:pl-0 group"
                >
                  <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-slate-200">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-400" />
                  </div>

                  <div className="flex flex-col md:flex-row gap-7 items-start">
                    <div className="shrink-0 text-7xl md:text-8xl font-display font-black text-slate-100 leading-none -mt-3 md:-mt-6 group-hover:text-teal-100 transition-colors duration-500">
                      {step.id}
                    </div>
                    <article className="relative z-10 -mt-5 md:mt-0">
                      <div className="w-16 h-16 bg-white shadow-xl shadow-indigo-900/5 border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-5 group-hover:bg-indigo-600 group-hover:text-white group-hover:-translate-y-1 transition-all duration-300">
                        <step.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-display font-bold text-indigo-950 mb-3 leading-tight">{step.title}</h3>
                      <p className="text-lg text-slate-600 leading-relaxed">{step.text}</p>
                    </article>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35 }}
            className="bg-indigo-950 text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">Готовы перейти к выбору проекта?</h2>
              <p className="mt-2 text-indigo-200">Продолжите путь в каталоге и сравните подходящие сценарии участия.</p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-teal-400 text-indigo-950 font-bold hover:bg-teal-300 transition-colors"
            >
              Перейти к проектам <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
