'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, MessageSquare } from 'lucide-react';

const faqs = [
  { q: 'Как вывести деньги?', a: 'Вы можете продать свою долю на вторичном рынке внутри платформы в любой момент. Обычно сделка занимает от 1 до 3 дней. Также возможен вывод средств по окончании срока проекта без комиссий.' },
  { q: 'Что если арендаторы уйдут?', a: 'Мы формируем резервный фонд для каждого объекта, который покрывает простой до 3 месяцев. Наша УК активно ищет новых арендаторов еще до окончания текущих договоров, минимизируя риски.' },
  { q: 'Что если объект упадёт в цене?', a: 'Мы инвестируем в ликвидные объекты с высоким потенциалом роста. Даже при временном снижении рыночной стоимости, арендный поток сохраняется, обеспечивая вам ежемесячный доход.' },
  { q: 'Как получить выплату?', a: 'Выплаты начисляются ежемесячно на ваш виртуальный счет в личном кабинете. Оттуда вы можете вывести их на любую банковскую карту РФ или реквизиты счета без комиссии.' },
  { q: 'Что такое коллективное финансирование?', a: 'Это механизм, при котором множество инвесторов объединяют свои капиталы для покупки крупного объекта коммерческой недвижимости, который недоступен им по отдельности. Вы получаете долю пропорционально вложениям.' },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
            
            <button className="inline-flex items-center gap-3 bg-teal-400 text-indigo-950 px-8 py-4 rounded-full font-bold hover:bg-teal-300 transition-colors shadow-xl shadow-teal-400/20 group">
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Задать вопрос брокеру
            </button>
          </div>

          {/* Right Accordion Column */}
          <div className="lg:col-span-7 space-y-2">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`border-b-2 transition-colors duration-300 ${openIndex === index ? 'border-teal-400' : 'border-indigo-800/50'}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-start justify-between py-8 text-left group"
                >
                  <span className={`text-2xl md:text-3xl font-display font-bold pr-8 transition-colors leading-tight ${openIndex === index ? 'text-white' : 'text-indigo-200 group-hover:text-white'}`}>
                    {faq.q}
                  </span>
                  <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors mt-1 ${openIndex === index ? 'bg-teal-400 text-indigo-950' : 'bg-indigo-900 text-indigo-400 group-hover:bg-indigo-800'}`}>
                    {openIndex === index ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 text-indigo-200 text-lg leading-relaxed pr-12 max-w-2xl">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
