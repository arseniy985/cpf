'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { AnimatePresence, motion } from 'motion/react';
import { MessageSquare, Minus, Plus, ShieldCheck, WalletCards, Layers3 } from 'lucide-react';
import Link from 'next/link';

type FaqItem = {
  id: string;
  q: string;
  a: string;
};

type FaqGroup = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  items: FaqItem[];
};

const groups: FaqGroup[] = [
  {
    id: 'platform',
    title: 'Платформа и старт',
    subtitle: 'Регистрация, кабинет и первые действия',
    icon: WalletCards,
    items: [
      {
        id: 'platform-1',
        q: 'С какой суммы можно начать и как стартовать на платформе?',
        a: 'Порог входа указан в карточке каждого проекта. После регистрации вы выбираете проект, изучаете условия участия и подтверждаете действия в личном кабинете.',
      },
      {
        id: 'platform-2',
        q: 'Что показывает личный кабинет инвестора?',
        a: 'В кабинете отражаются активные проекты, история операций, статусы начислений и доступные документы по вашему участию.',
      },
      {
        id: 'platform-3',
        q: 'Можно ли распределить капитал между несколькими проектами?',
        a: 'Да. Платформа поддерживает портфельный подход: вы можете участвовать в нескольких проектах и отслеживать результаты в одном интерфейсе.',
      },
    ],
  },
  {
    id: 'projects',
    title: 'Проекты и аналитика',
    subtitle: 'Параметры объекта и риск-профиль',
    icon: Layers3,
    items: [
      {
        id: 'projects-1',
        q: 'Какие данные есть в карточке проекта перед входом?',
        a: 'Карточка содержит ключевые параметры участия: формат актива, срок, ориентиры доходности, статус проекта и блок документов.',
      },
      {
        id: 'projects-2',
        q: 'Как оцениваются риски и кто проводит проверку проекта?',
        a: 'По проекту формируется аналитический контур с юридической, коммерческой и операционной частью. Вы видите не только потенциал, но и ограничения.',
      },
      {
        id: 'projects-3',
        q: 'Как выбрать проект под свой риск-профиль?',
        a: 'Сравнивайте горизонт участия, структуру выплат, сценарии риска и уровень вовлеченности. При необходимости подключайте консультацию до входа.',
      },
    ],
  },
  {
    id: 'payments',
    title: 'Выплаты и защита',
    subtitle: 'Документы, начисления и выход',
    icon: ShieldCheck,
    items: [
      {
        id: 'payments-1',
        q: 'Как формируются выплаты и где смотреть график?',
        a: 'Механика выплат и периодичность фиксируются в документах проекта. Актуальные статусы и история начислений доступны в личном кабинете.',
      },
      {
        id: 'payments-2',
        q: 'Какие документы доступны инвестору в процессе участия?',
        a: 'По каждому проекту доступен комплект материалов: договорные документы, регламенты, статусные обновления и отчетные файлы.',
      },
      {
        id: 'payments-3',
        q: 'Как работает вывод средств и сценарий досрочного выхода?',
        a: 'Условия вывода и досрочного выхода зависят от структуры конкретного проекта и фиксируются заранее до подтверждения участия.',
      },
    ],
  },
];

export default function FaqPage() {
  const [activeGroupId, setActiveGroupId] = useState(groups[0].id);
  const [openQuestionId, setOpenQuestionId] = useState(groups[0].items[0].id);

  const activeGroup = useMemo(
    () => groups.find((group) => group.id === activeGroupId) ?? groups[0],
    [activeGroupId]
  );

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 text-indigo-950">
      <Header />
      <div className="flex-1 pt-12 pb-24">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-10"
          >
            <div className="w-16 h-2 bg-teal-400 mb-5" />
            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-[1.02]">
              Частые
              <br />
              <span className="text-teal-500">вопросы</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
              Выберите нужный блок и откройте конкретный вопрос. Показываем только релевантный раздел, без длинного списка на всю страницу.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-5">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-7 shadow-sm">
                <div className="w-14 h-2 bg-teal-400 mb-6" />
                <h2 className="text-3xl md:text-4xl font-display font-bold leading-[1.1] tracking-tight text-indigo-950">
                  Всё, что нужно
                  <br />
                  знать перед
                  <br />
                  <span className="text-teal-500">стартом</span>
                </h2>
                <p className="mt-5 text-slate-600 leading-relaxed">Выберите тематический блок, чтобы переключить набор вопросов.</p>
              </div>

              <div className="grid gap-3">
                {groups.map((group, index) => (
                  <button
                    key={group.id}
                    onClick={() => {
                      setActiveGroupId(group.id);
                      setOpenQuestionId(group.items[0].id);
                    }}
                    className={`text-left border rounded-2xl p-4 transition-colors ${
                      activeGroup.id === group.id
                        ? 'bg-indigo-950 text-white border-indigo-950'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          activeGroup.id === group.id ? 'bg-teal-400 text-indigo-950' : 'bg-indigo-100 text-indigo-600'
                        }`}
                      >
                        <group.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em]">{String(index + 1).padStart(2, '0')}</p>
                        <p className="mt-1 font-bold">{group.title}</p>
                        <p className={`mt-1 text-xs ${activeGroup.id === group.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                          {group.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <Link
                href="/contacts"
                className="inline-flex items-center gap-3 bg-teal-400 text-indigo-950 px-7 py-4 rounded-full font-bold hover:bg-teal-300 transition-colors shadow-lg shadow-teal-500/20 group"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Задать вопрос брокеру
              </Link>
            </aside>

            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl px-6 md:px-8 py-3 shadow-sm">
              <div className="py-5 border-b border-slate-200">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-indigo-950">{activeGroup.title}</h3>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGroup.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-0"
                >
                  {activeGroup.items.map((item) => {
                    const isOpen = openQuestionId === item.id;
                    return (
                      <article
                        key={item.id}
                        className={`border-b-2 transition-colors duration-300 ${isOpen ? 'border-teal-400' : 'border-slate-200'}`}
                      >
                        <button
                          onClick={() => setOpenQuestionId(isOpen ? '' : item.id)}
                          className="w-full flex items-start justify-between gap-4 py-7 text-left group"
                        >
                          <h4
                            className={`text-2xl md:text-3xl font-display font-bold pr-3 leading-tight transition-colors ${
                              isOpen ? 'text-indigo-950' : 'text-indigo-900 group-hover:text-indigo-950'
                            }`}
                          >
                            {item.q}
                          </h4>
                          <div
                            className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors mt-1 ${
                              isOpen ? 'bg-teal-400 text-indigo-950' : 'bg-indigo-100 text-indigo-600'
                            }`}
                          >
                            {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="pb-7 text-slate-600 text-lg leading-relaxed pr-10">{item.a}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </article>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
