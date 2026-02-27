'use client';

import { motion } from 'motion/react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const articles = [
  {
    id: 1,
    title: 'Как открыть рекламное агентство с нуля: пошаговое руководство',
    date: '20 Фев 2026',
    category: 'Бизнес-планы',
    author: 'Андрей Афанасенко',
    image: 'https://picsum.photos/seed/blog1/800/600',
  },
  {
    id: 2,
    title: 'Инвестиции в стрит-ритейл: почему это выгоднее банковского вклада',
    date: '18 Фев 2026',
    category: 'Аналитика',
    author: 'Елена Смирнова',
    image: 'https://picsum.photos/seed/blog2/800/600',
  },
  {
    id: 3,
    title: 'Как мы проверяем объекты перед покупкой: чек-лист Due Diligence',
    date: '15 Фев 2026',
    category: 'Экспертиза',
    author: 'Михаил Волков',
    image: 'https://picsum.photos/seed/blog3/800/600',
  },
];

export default function BlogPreview() {
  return (
    <section className="py-32 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="w-16 h-2 bg-indigo-600 mb-6"></div>
            <h2 className="text-4xl md:text-6xl font-display font-black text-indigo-950 mb-4 tracking-tighter">
              БЛОГ И АНАЛИТИКА
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl font-medium leading-relaxed">
              Экспертные материалы, разбор кейсов и тренды рынка коммерческой недвижимости.
            </p>
          </div>
          <Link href="/blog" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors uppercase tracking-wider text-sm">
            Все статьи <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-900/5 transition-all flex flex-col cursor-pointer"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-indigo-950 uppercase tracking-wider shadow-sm">
                  {article.category}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mb-4">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {article.date}</span>
                  <span className="flex items-center gap-2"><User className="w-4 h-4" /> {article.author}</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-indigo-950 mb-6 leading-tight group-hover:text-indigo-600 transition-colors">
                  {article.title}
                </h3>
                <div className="mt-auto flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-wider text-sm">
                  Читать статью <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/blog" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors uppercase tracking-wider text-sm">
            Все статьи <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
