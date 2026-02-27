'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { motion } from 'motion/react';
import Image from 'next/image';
import { ArrowRight, Calendar, User } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Как открыть рекламное агентство с нуля: пошаговое руководство',
    date: '20 Фев 2026',
    category: 'Бизнес-планы',
    author: 'Андрей Афанасенко',
    image: 'https://picsum.photos/seed/blog1/800/600',
    featured: true,
  },
  {
    id: 2,
    title: 'Инвестиции в стрит-ритейл: почему это выгоднее банковского вклада',
    date: '18 Фев 2026',
    category: 'Аналитика',
    author: 'Елена Смирнова',
    image: 'https://picsum.photos/seed/blog2/800/600',
    featured: false,
  },
  {
    id: 3,
    title: 'Как мы проверяем объекты перед покупкой: чек-лист Due Diligence',
    date: '15 Фев 2026',
    category: 'Экспертиза',
    author: 'Михаил Волков',
    image: 'https://picsum.photos/seed/blog3/800/600',
    featured: false,
  },
  {
    id: 4,
    title: 'Тренды коммерческой недвижимости в 2026 году',
    date: '10 Фев 2026',
    category: 'Тренды',
    author: 'Анна Ковалева',
    image: 'https://picsum.photos/seed/blog4/800/600',
    featured: false,
  },
  {
    id: 5,
    title: 'Кейс: как мы увеличили доходность ТЦ на 40% за год',
    date: '05 Фев 2026',
    category: 'Кейсы',
    author: 'Андрей Афанасенко',
    image: 'https://picsum.photos/seed/blog5/800/600',
    featured: false,
  }
];

export default function BlogPage() {
  const featured = articles.find(a => a.featured);
  const rest = articles.filter(a => !a.featured);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-16 relative">
            <div className="w-16 h-2 bg-indigo-600 mb-8"></div>
            <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 tracking-tighter">
              БЛОГ И <span className="text-teal-400">АНАЛИТИКА</span>
            </h1>
          </div>

          {/* Featured Article */}
          {featured && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="mb-16 bg-indigo-950 rounded-[40px] overflow-hidden flex flex-col lg:flex-row group cursor-pointer"
            >
              <div className="lg:w-1/2 relative min-h-[400px]">
                <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center text-white">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-teal-400 text-indigo-950 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-2 text-indigo-300 text-sm font-medium">
                    <Calendar className="w-4 h-4" /> {featured.date}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight group-hover:text-teal-400 transition-colors">
                  {featured.title}
                </h2>
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-indigo-800/50">
                  <div className="flex items-center gap-3 text-indigo-200">
                    <User className="w-5 h-5" />
                    <span className="font-medium">{featured.author}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-indigo-800 flex items-center justify-center group-hover:bg-teal-400 group-hover:text-indigo-950 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {rest.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[32px] border border-slate-200 overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-indigo-900/5 transition-all flex flex-col"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-indigo-950 uppercase tracking-wider">
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

        </div>
      </div>
      <Footer />
    </main>
  );
}
