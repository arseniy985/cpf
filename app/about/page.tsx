'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="w-16 h-2 bg-teal-400 mb-8"></div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 tracking-tighter leading-[1.1] mb-8">
                МЫ СТРОИМ <br/> МОСТ МЕЖДУ <br/>
                <span className="text-indigo-600">КАПИТАЛОМ</span> И <br/>
                <span className="text-teal-400">БИЗНЕСОМ</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                ЦПФ — это экосистема, где инвесторы находят надежные активы, а предприниматели получают ресурсы для роста.
              </p>
            </div>
            <div className="relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl shadow-indigo-900/20">
              <Image src="https://picsum.photos/seed/office/800/1000" alt="Офис" fill className="object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-indigo-950/20 mix-blend-overlay"></div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-32">
            <h2 className="text-4xl font-display font-bold text-indigo-950 mb-12 text-center">Наши принципы</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Прозрачность', desc: 'Открытая аналитика, честные отчеты и полная юридическая чистота каждой сделки.' },
                { title: 'Надежность', desc: 'Тщательный Due Diligence и формирование резервных фондов для защиты капитала.' },
                { title: 'Инновации', desc: 'Использование современных IT-решений для удобного управления инвестициями.' }
              ].map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-10 rounded-[32px] border border-slate-200">
                  <div className="text-5xl font-display font-black text-slate-100 mb-6">0{i+1}</div>
                  <h3 className="text-2xl font-bold text-indigo-950 mb-4">{v.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div>
            <h2 className="text-4xl font-display font-bold text-indigo-950 mb-12 text-center">Команда экспертов</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative h-80 rounded-[32px] overflow-hidden mb-4">
                    <Image src={`https://picsum.photos/seed/team${i}/400/600`} alt="Команда" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="text-xl font-bold text-indigo-950">Имя Фамилия</h4>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mt-1">Должность</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
