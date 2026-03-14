'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, Phone, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickQuestions = [
  'Как начать инвестировать?',
  'Какие проекты сейчас доступны?',
  'Хочу привлечь капитал в объект',
];

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/owner')) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.18 }}
            className="mb-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/12"
          >
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Связь с менеджером</p>
                  <h3 className="mt-1 text-xl font-display font-bold text-indigo-950">
                    Нужна помощь по платформе?
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Напишите в Telegram или позвоните. Если удобнее, оставьте вопрос и команда ЦПФ
                свяжется с вами вручную.
              </p>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="flex flex-col gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-900"
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent('open-modal', {
                          detail: { type: 'consult', prefillMessage: question },
                        }),
                      );
                      setIsOpen(false);
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <a
                  href="tel:+74951369888"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-900"
                >
                  <Phone className="h-4 w-4" />
                  Позвонить
                </a>
                <a
                  href="https://t.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-900"
                >
                  <Send className="h-4 w-4" />
                  Telegram
                </a>
              </div>

              <Button
                type="button"
                className="h-12 w-full rounded-2xl bg-teal-400 text-indigo-950 hover:bg-teal-500"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-modal', { detail: { type: 'consult' } }));
                  setIsOpen(false);
                }}
              >
                Оставить заявку
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Button
        type="button"
        size="lg"
        className="h-14 rounded-full bg-indigo-950 px-5 text-white shadow-xl shadow-indigo-950/20 hover:bg-indigo-900"
        onClick={() => setIsOpen((value) => !value)}
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Связаться
      </Button>
    </div>
  );
}
