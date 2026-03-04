'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { motion } from 'motion/react';
import { MapPin, TrendingUp, Clock, ArrowRight, Filter, Search } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { projectCategories, projects } from '@/lib/domain/projects';

export default function ProjectsPage() {
  const [filter, setFilter] = useState('Все');

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-32">
        
        {/* Asymmetrical Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative">
          <div className="absolute top-0 right-10 w-64 h-64 bg-teal-400 rounded-full blur-3xl opacity-20 -z-10"></div>
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-10 -z-10"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="w-16 h-2 bg-teal-400 mb-8"></div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-indigo-950 tracking-tighter leading-[0.9] mb-6">
                КАТАЛОГ <br/> 
                <span className="text-indigo-600 ml-8 md:ml-24">АКТИВОВ</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl ml-4 md:ml-12 border-l-4 border-teal-400 pl-6 leading-relaxed">
                Инвестируйте в проверенный бизнес и коммерческую недвижимость с доходностью до 45% годовых.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xl shadow-indigo-900/5 flex items-center gap-4 max-w-md w-full">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Поиск по названию или ID..."
                className="w-full bg-transparent border-none focus:outline-none text-slate-700 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-indigo-950 text-white rounded-full text-sm font-bold mr-4 shadow-lg shadow-indigo-950/20">
              <Filter className="w-4 h-4" /> Фильтры
            </div>
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                  filter === cat
                    ? 'bg-teal-400 text-indigo-950 shadow-lg shadow-teal-400/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.filter(p => filter === 'Все' || p.category === filter).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-900/10 hover:border-indigo-200 transition-all flex flex-col"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
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
                    {project.funded === 100 ? (
                      <span className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-slate-400 cursor-not-allowed">
                        <ArrowRight className="w-6 h-6" />
                      </span>
                    ) : (
                      <Link
                        href={`/projects/${project.id}`}
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-lg shadow-indigo-600/20 transition-all duration-300"
                        aria-label={`Подробнее о проекте ${project.title}`}
                      >
                        <ArrowRight className="w-6 h-6" />
                      </Link>
                    )}
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
