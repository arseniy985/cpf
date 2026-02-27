'use client';

import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export default function Stats() {
  return (
    <section className="py-24 bg-indigo-950 text-white relative overflow-hidden">
      {/* Asymmetrical background shapes */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-900 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-blue-900 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="w-20 h-2 bg-teal-400 mb-8"></div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-[1.1] tracking-tight">
              Цифры, которые <br/>
              <span className="text-teal-400">говорят сами</span> <br/>
              за себя
            </h2>
            <p className="text-indigo-200 text-lg max-w-md leading-relaxed mb-8">
              Мы строим прозрачную экосистему, где каждый инвестор видит реальный результат своей работы с нами. Никаких скрытых комиссий — только чистая прибыль.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/inv${i}/100/100`} className="w-12 h-12 rounded-full border-2 border-indigo-950" alt="investor" />
                ))}
              </div>
              <div className="text-sm font-medium text-indigo-300">
                Присоединяйтесь к <br/><span className="text-white font-bold">15,000+ инвесторам</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {/* Bento stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="sm:col-span-2 bg-indigo-900/40 backdrop-blur-sm p-8 md:p-10 rounded-[40px] border border-indigo-800 flex flex-col md:flex-row items-start md:items-center justify-between group hover:bg-indigo-900/60 transition-colors"
            >
              <div>
                <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-3">Выплачено дохода</p>
                <p className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter">
                  1.2 <span className="text-3xl md:text-4xl text-teal-400 tracking-normal">млрд ₽</span>
                </p>
              </div>
              <div className="mt-6 md:mt-0 w-20 h-20 bg-teal-400 rounded-full flex items-center justify-center text-indigo-950 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-teal-400/20 shrink-0">
                <ArrowUpRight className="w-10 h-10" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-indigo-900/40 backdrop-blur-sm p-8 md:p-10 rounded-[40px] border border-indigo-800 hover:bg-indigo-900/60 transition-colors flex flex-col justify-between min-h-[200px]"
            >
              <p className="text-indigo-300 text-sm font-bold uppercase tracking-widest mb-4">Активных проектов</p>
              <p className="text-5xl md:text-6xl font-display font-black text-white tracking-tighter">
                42<span className="text-teal-400">+</span>
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-teal-400 p-8 md:p-10 rounded-[40px] border border-teal-300 text-indigo-950 hover:bg-teal-300 transition-colors flex flex-col justify-between min-h-[200px] shadow-xl shadow-teal-400/10"
            >
              <p className="text-indigo-900/70 text-sm font-bold uppercase tracking-widest mb-4">Средняя доходность</p>
              <p className="text-5xl md:text-6xl font-display font-black tracking-tighter">
                21.5<span className="text-3xl md:text-4xl">%</span>
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
