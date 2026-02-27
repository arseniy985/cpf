'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { MapPin, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const projects = [
  {
    id: 1,
    title: 'Торговый центр "Галерея"',
    category: 'Арендный бизнес',
    location: 'Москва, ЦАО',
    minInvestment: '50 000 ₽',
    yield: '22.5%',
    term: '36 мес',
    funded: 85,
    image: 'https://picsum.photos/seed/building1/800/600',
    status: 'Сбор средств',
  },
  {
    id: 2,
    title: 'Складской комплекс А+',
    category: 'Логистика',
    location: 'Московская область',
    minInvestment: '10 000 ₽',
    yield: '19.8%',
    term: '24 мес',
    funded: 100,
    image: 'https://picsum.photos/seed/warehouse/800/600',
    status: 'Успешно профинансирован',
  },
  {
    id: 3,
    title: 'Сеть стрит-ритейла',
    category: 'Редевелопмент',
    location: 'Санкт-Петербург',
    minInvestment: '100 000 ₽',
    yield: '26.0%',
    term: '12 мес',
    funded: 45,
    image: 'https://picsum.photos/seed/street/800/600',
    status: 'Сбор средств',
  },
];

export default function Projects() {
  const [filter, setFilter] = useState('Все');

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="w-16 h-2 bg-teal-400 mb-6"></div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-indigo-950 mb-4 tracking-tighter">
              Доступные проекты
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl font-medium">
              Тщательно отобранные объекты коммерческой недвижимости с высокой доходностью и минимальными рисками.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Все', 'Арендный бизнес', 'Редевелопмент', 'Займы'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  filter === cat
                    ? 'bg-indigo-950 text-white shadow-lg shadow-indigo-950/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-900/10 hover:border-indigo-200 transition-all flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 to-transparent opacity-50"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-indigo-950 uppercase tracking-wider shadow-sm">
                    {project.category}
                  </span>
                </div>
                {project.funded === 100 && (
                  <div className="absolute inset-0 bg-indigo-950/60 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-teal-400 text-indigo-950 px-6 py-2 rounded-full font-bold uppercase tracking-wider shadow-xl">
                      Сбор закрыт
                    </span>
                  </div>
                )}
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs mb-4 uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </div>
                <h3 className="text-2xl font-display font-bold text-indigo-950 mb-6 line-clamp-2 leading-tight">
                  {project.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-8 mt-auto">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Доходность</p>
                    <p className="text-xl font-display font-black text-indigo-600 flex items-center gap-1">
                      <TrendingUp className="w-5 h-5" /> {project.yield}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Срок</p>
                    <p className="text-xl font-display font-black text-indigo-950 flex items-center gap-1">
                      <Clock className="w-5 h-5" /> {project.term}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-3 font-bold">
                    <span className="text-slate-500">Собрано</span>
                    <span className="text-indigo-950">{project.funded}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${project.funded === 100 ? 'bg-slate-400' : 'bg-teal-400'}`}
                      style={{ width: `${project.funded}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Мин. сумма</p>
                    <p className="text-xl font-display font-black text-indigo-950">{project.minInvestment}</p>
                  </div>
                  <button 
                    className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${
                      project.funded === 100 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-lg shadow-indigo-600/20'
                    }`}
                    disabled={project.funded === 100}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/projects" className="inline-flex items-center justify-center gap-2 bg-white text-indigo-950 border-2 border-slate-200 px-10 py-5 rounded-full font-bold hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm">
            Смотреть все проекты
          </Link>
        </div>
      </div>
    </section>
  );
}
