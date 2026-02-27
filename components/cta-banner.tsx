'use client';

import { motion } from 'motion/react';
import { Send } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-indigo-950 rounded-[40px] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl shadow-indigo-900/20"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tighter">
              Получайте эксклюзивные <br/> <span className="text-teal-400">предложения первыми</span>
            </h2>
            <p className="text-indigo-200 text-xl leading-relaxed">
              Мгновенные уведомления о новых объектах недвижимости и готовом бизнесе. Не упустите выгодную сделку!
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button className="bg-teal-400 text-indigo-950 px-10 py-5 rounded-full font-bold text-lg hover:bg-teal-500 transition-colors flex items-center gap-3 shadow-xl shadow-teal-400/20">
              <Send className="w-6 h-6" />
              Перейти в Telegram-бот
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
