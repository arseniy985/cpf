'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Phone, User, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setIsSent(true);
      setMessage('');
      setTimeout(() => setIsSent(false), 3000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[32px] shadow-2xl shadow-indigo-900/20 border border-slate-200 w-[360px] mb-4 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-indigo-950 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Image src="https://picsum.photos/seed/manager/100/100" alt="Менеджер" width={48} height={48} className="rounded-full border-2 border-indigo-800" referrerPolicy="no-referrer" />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-teal-400 border-2 border-indigo-950 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight">Алексей</h4>
                    <p className="text-indigo-300 text-xs font-medium uppercase tracking-wider mt-0.5">Старший брокер</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-indigo-300 hover:text-white transition-colors bg-indigo-900/50 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 bg-slate-50 flex-1 h-[320px] overflow-y-auto">
              <div className="flex flex-col gap-4">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm max-w-[85%]">
                  <p className="text-sm text-slate-700 leading-relaxed">Здравствуйте! 👋 Я Алексей, эксперт ЦПФ. Помогу подобрать проект под ваш бюджет или отвечу на вопросы по платформе.</p>
                </div>
                
                {/* Quick Replies */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <button onClick={() => setMessage('Как начать инвестировать?')} className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-2 rounded-full hover:bg-indigo-200 transition-colors">Как начать?</button>
                  <button onClick={() => setMessage('Какие гарантии?')} className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-2 rounded-full hover:bg-indigo-200 transition-colors">Гарантии</button>
                  <button onClick={() => setMessage('Хочу продать бизнес')} className="text-xs font-bold bg-teal-100 text-teal-700 px-3 py-2 rounded-full hover:bg-teal-200 transition-colors">Продать бизнес</button>
                </div>

                {isSent && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="self-end bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[85%]">
                    <p className="text-sm">Сообщение отправлено. Отвечу через минуту!</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                />
                <button type="submit" disabled={!message.trim()} className="absolute right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-indigo-700 transition-colors">
                  <Send className="w-4 h-4 -ml-0.5" />
                </button>
              </form>
              <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
                <a href="tel:+74951369888" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-wider">
                  <Phone className="w-4 h-4" /> Позвонить
                </a>
                <a href="#" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-wider">
                  <Send className="w-4 h-4" /> Telegram
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl transition-colors duration-300 border-2 ${
          isOpen 
            ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' 
            : 'bg-indigo-950 text-white border-indigo-800 hover:bg-indigo-900 shadow-indigo-900/30'
        }`}
      >
        {!isOpen && (
          <div className="relative flex items-center justify-center w-8 h-8">
            <Image src="https://picsum.photos/seed/manager/100/100" alt="Менеджер" fill className="rounded-full object-cover border-2 border-indigo-800" referrerPolicy="no-referrer" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 border-2 border-indigo-950 rounded-full"></div>
          </div>
        )}
        {isOpen ? <X className="w-6 h-6" /> : <span className="font-bold text-sm tracking-wide">Задать вопрос</span>}
      </motion.button>
    </div>
  );
}
