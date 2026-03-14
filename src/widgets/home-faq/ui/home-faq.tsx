'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useFaqsQuery } from '@/entities/content/api/hooks';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export default function Faq() {
  const faqsQuery = useFaqsQuery();
  const faqs = useMemo(() => faqsQuery.data?.slice(0, 5) ?? [], [faqsQuery.data]);

  return (
    <section id="faq" className="py-32 bg-indigo-950 text-white overflow-hidden relative">
      {/* Decorative huge text */}
      <div className="absolute top-20 left-0 text-[15vw] font-display font-black text-indigo-900/30 leading-none whitespace-nowrap pointer-events-none select-none">
        ВОПРОСЫ
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Asymmetrical Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <div className="w-20 h-2 bg-teal-400 mb-8"></div>
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-8 leading-[1.1] tracking-tight">
              Всё, что нужно <br/> знать перед <br/>
              <span className="text-teal-400">стартом</span>
            </h2>
            <p className="text-indigo-200 text-lg mb-12 leading-relaxed max-w-md">
              Мы за полную прозрачность. Если вы не нашли ответ на свой вопрос — напишите нам, и мы разберем вашу ситуацию индивидуально.
            </p>
            
            <Button asChild size="lg" className="gap-3">
              <Link href="/contacts">
                <MessageSquare className="w-5 h-5" />
                Задать вопрос брокеру
              </Link>
            </Button>
          </div>

          {/* Right Accordion Column */}
          <div className="lg:col-span-7 space-y-2">
            {faqs.length === 0 && (
              <div className="rounded-3xl border border-indigo-800 bg-indigo-900/30 p-6 text-indigo-200">
                Загружаем список вопросов...
              </div>
            )}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Accordion type="single" collapsible defaultValue={faqs[0]?.id} className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border-b-2 border-indigo-800/50 data-[state=open]:border-teal-400"
                  >
                    <AccordionTrigger className="py-8 text-2xl md:text-3xl text-white">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="max-w-2xl pr-12 text-lg text-indigo-200">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
