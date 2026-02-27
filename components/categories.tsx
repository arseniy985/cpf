'use client';

import { motion } from 'motion/react';
import { ShoppingCart, Stethoscope, Coffee, Laptop, Wrench, Building, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Торговля и ритейл', icon: ShoppingCart, count: 142 },
  { name: 'Медицина и клиники', icon: Stethoscope, count: 56 },
  { name: 'Общепит и рестораны', icon: Coffee, count: 89 },
  { name: 'IT и технологии', icon: Laptop, count: 34 },
  { name: 'Производство', icon: Wrench, count: 47 },
  { name: 'Арендный бизнес', icon: Building, count: 215 },
];

export default function Categories() {
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-indigo-950">
            Популярные сферы бизнеса
          </h2>
          <Link href="/projects" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
            Все категории <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group cursor-pointer"
            >
              <div className="bg-slate-50 rounded-[32px] p-6 flex flex-col items-center text-center border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-xl hover:shadow-indigo-900/5 transition-all h-full">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:bg-teal-400 group-hover:text-indigo-950 text-indigo-600 transition-all duration-300">
                  <category.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-indigo-950 mb-1 text-sm">{category.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{category.count} предложений</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
