'use client';

import { useMemo, useState } from 'react';
import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import { motion } from 'motion/react';
import { MessageSquare, ShieldCheck, WalletCards, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { useFaqsQuery } from '@/entities/content/api/hooks';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

const groupMeta: Record<string, Pick<FaqGroup, 'title' | 'subtitle' | 'icon'>> = {
  Инвестиции: {
    title: 'Инвестиции и кабинет',
    subtitle: 'Регистрация, действия инвестора и выплаты',
    icon: WalletCards,
  },
  Сделки: {
    title: 'Сделки и проверка проектов',
    subtitle: 'Каталог, аналитика и структура проекта',
    icon: Layers3,
  },
};

export default function FaqPage() {
  const faqsQuery = useFaqsQuery();
  const groups = useMemo<FaqGroup[]>(() => {
    const faqItems = faqsQuery.data;

    if (!faqItems) {
      return [];
    }

    const grouped = faqItems.reduce<Record<string, typeof faqItems>>((accumulator, item) => {
      const key = item.groupName;

      if (!accumulator[key]) {
        accumulator[key] = [];
      }

      accumulator[key].push(item);

      return accumulator;
    }, {});

    return Object.entries(grouped).map(([groupName, items]) => {
      const meta = groupMeta[groupName] ?? {
        title: groupName,
        subtitle: 'Ответы по разделу платформы',
        icon: ShieldCheck,
      };

      return {
        id: groupName,
        title: meta.title,
        subtitle: meta.subtitle,
        icon: meta.icon,
        items: (items ?? []).map((item) => ({
          id: item.id,
          q: item.question,
          a: item.answer,
        })),
      };
    });
  }, [faqsQuery.data]);

  const [activeGroupId, setActiveGroupId] = useState('');

  const normalizedActiveGroupId = activeGroupId || groups[0]?.id || '';

  const activeGroup = useMemo(
    () => groups.find((group) => group.id === normalizedActiveGroupId) ?? groups[0],
    [groups, normalizedActiveGroupId]
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
                  <Button
                    key={group.id}
                    onClick={() => {
                      setActiveGroupId(group.id);
                    }}
                    variant="ghost"
                    className={`h-auto w-full rounded-2xl border p-4 text-left transition-colors ${
                      activeGroup?.id === group.id
                        ? 'border-indigo-950 bg-indigo-950 text-white hover:bg-indigo-900 hover:text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          activeGroup?.id === group.id ? 'bg-teal-400 text-indigo-950' : 'bg-indigo-100 text-indigo-600'
                        }`}
                      >
                        <group.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em]">{String(index + 1).padStart(2, '0')}</p>
                        <p className="mt-1 font-bold">{group.title}</p>
                        <p className={`mt-1 text-xs ${activeGroup?.id === group.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                          {group.subtitle}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              <Button asChild size="lg" className="gap-3">
                <Link href="/contacts">
                  <MessageSquare className="w-5 h-5" />
                  Задать вопрос брокеру
                </Link>
              </Button>
            </aside>

            <Card className="lg:col-span-8 px-2 py-3">
              {!activeGroup && (
                <div className="py-6 text-slate-500">Загружаем блоки FAQ...</div>
              )}

              {activeGroup && (
                <>
                  <CardContent>
                    <div className="border-b border-slate-200 py-5">
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-indigo-950">{activeGroup.title}</h3>
                    </div>

                    <motion.div
                  key={activeGroup.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-0"
                >
                      <Accordion type="single" collapsible className="w-full" defaultValue={activeGroup.items[0]?.id}>
                        {activeGroup.items.map((item) => (
                          <AccordionItem
                            key={item.id}
                            value={item.id}
                            className="border-b-2 border-slate-200 data-[state=open]:border-teal-400"
                          >
                            <AccordionTrigger className="py-7 text-2xl md:text-3xl text-indigo-950">
                              {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="pr-10 text-lg text-slate-600">
                              {item.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
