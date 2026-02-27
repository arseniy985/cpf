'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';

export default function GlobalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'invest' | 'consult'>('consult');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleOpen = (e: any) => {
      setType(e.detail?.type || 'consult');
      setIsSubmitted(false);
      setIsOpen(true);
    };
    window.addEventListener('open-modal', handleOpen);
    return () => window.removeEventListener('open-modal', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 md:p-12 relative z-10">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-display font-bold text-indigo-950 mb-4">Заявка принята!</h3>
                <p className="text-slate-600 text-lg">
                  Наш эксперт свяжется с вами в ближайшее время для обсуждения деталей.
                </p>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="mt-8 w-full bg-indigo-950 text-white font-bold py-4 rounded-xl hover:bg-indigo-800 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-2 bg-teal-400 mb-6"></div>
                <h3 className="text-3xl font-display font-bold text-indigo-950 mb-2">
                  {type === 'invest' ? 'Начать инвестировать' : 'Бесплатная консультация'}
                </h3>
                <p className="text-slate-500 mb-8">
                  {type === 'invest' 
                    ? 'Оставьте свои контакты, и мы поможем подобрать оптимальный портфель активов.' 
                    : 'Наши эксперты ответят на все вопросы и помогут с выбором стратегии.'}
                </p>

                <form 
                  onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-bold text-indigo-950 mb-2 ml-1">Как к вам обращаться?</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Иван Иванов"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-indigo-950 mb-2 ml-1">Номер телефона</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+7 (___) ___-__-__"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-teal-400 text-indigo-950 font-bold py-4 rounded-2xl hover:bg-teal-500 transition-colors mt-4 shadow-xl shadow-teal-400/20 text-lg"
                  >
                    {type === 'invest' ? 'Получить предложения' : 'Отправить заявку'}
                  </button>

                  <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
                    Нажимая на кнопку, вы даете согласие на обработку <a href="#" className="underline hover:text-indigo-600">персональных данных</a>
                  </p>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
