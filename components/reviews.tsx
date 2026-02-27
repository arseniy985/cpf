'use client';

import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const reviews = [
  {
    id: 1,
    name: 'Александр Смирнов',
    role: 'Инвестор с 2024 года',
    image: 'https://picsum.photos/seed/user1/100/100',
    text: 'Долго искал альтернативу банковским вкладам. ЦПФ привлек прозрачностью и низким порогом входа. Инвестировал в стрит-ритейл, выплаты приходят день в день. Очень удобный личный кабинет.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Елена Ковалева',
    role: 'Предприниматель',
    image: 'https://picsum.photos/seed/user2/100/100',
    text: 'Для меня главное — безопасность капитала. Изучила все документы платформы с юристом, схема полностью легальна и защищает инвестора. Сейчас мой портфель здесь составляет более 2 млн рублей.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Михаил Волков',
    role: 'IT-специалист',
    image: 'https://picsum.photos/seed/user3/100/100',
    text: 'Отличный инструмент для диверсификации. Не нужно самому искать объекты, делать ремонт и общаться с арендаторами. Просто получаешь пассивный доход. Рекомендую тариф "Сбалансированный".',
    rating: 5,
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-32 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="w-20 h-2 bg-teal-400 mx-auto mb-8"></div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-indigo-950 mb-6 tracking-tighter">
            ОТЗЫВЫ ИНВЕСТОРОВ
          </h2>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            Реальные истории людей, которые уже получают пассивный доход вместе с нами.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 p-10 rounded-[40px] border border-slate-200 relative group hover:bg-indigo-950 transition-colors duration-500"
            >
              <Quote className="absolute top-10 right-10 w-12 h-12 text-slate-200 group-hover:text-indigo-800 transition-colors duration-500" />
              
              <div className="flex items-center gap-1 mb-8">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-teal-400 text-teal-400" />
                ))}
              </div>
              
              <p className="text-slate-700 group-hover:text-indigo-200 leading-relaxed mb-10 relative z-10 text-lg transition-colors duration-500">
                &quot;{review.text}&quot;
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <Image
                  src={review.image}
                  alt={review.name}
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-white group-hover:border-indigo-800 transition-colors duration-500"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-indigo-950 group-hover:text-white transition-colors duration-500">{review.name}</h4>
                  <p className="text-sm font-bold text-slate-500 group-hover:text-indigo-400 uppercase tracking-wider mt-1 transition-colors duration-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
