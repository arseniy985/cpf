'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Building2, MapPin, Clock, Send, MessageCircle, Search, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { name: 'Каталог активов', href: '/projects' },
  { name: 'Услуги', href: '/services' },
  { name: 'Блог и аналитика', href: '/blog' },
  { name: 'О компании', href: '/about' },
  { name: 'Карьера', href: '/career' },
  { name: 'Контакты', href: '/contacts' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openModal = (type: 'invest' | 'consult') => {
    window.dispatchEvent(new CustomEvent('open-modal', { detail: { type } }));
  };

  return (
    <header className="w-full flex flex-col z-50 bg-white shadow-sm sticky top-0">
      {/* Top bar */}
      <div className="hidden lg:flex justify-between items-center px-8 py-2 border-b border-slate-100 text-xs text-slate-500 bg-slate-50">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-600"/> г. Москва, Пресненская наб., 12</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-600"/> Пн-Вс 9:00 - 21:00</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="tel:+74951369888" className="font-bold text-slate-800 hover:text-indigo-600 transition flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-indigo-600"/> +7 (495) 136-98-88
          </a>
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-1.5 hover:text-blue-500 transition"><Send className="w-3.5 h-3.5 text-blue-500"/> Telegram</a>
            <a href="#" className="flex items-center gap-1.5 hover:text-green-500 transition"><MessageCircle className="w-3.5 h-3.5 text-green-500"/> WhatsApp</a>
          </div>
        </div>
      </div>

      {/* Middle bar */}
      <div className="flex justify-between items-center px-4 lg:px-8 py-4 gap-8">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:bg-indigo-700 transition-colors transform group-hover:scale-105 duration-300">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl leading-none text-indigo-950 uppercase tracking-wider">ЦПФ</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Инвестиции</span>
          </div>
        </Link>

        <div className="hidden lg:flex flex-1 max-w-2xl relative group">
          <input 
            type="text" 
            placeholder="Поиск готового бизнеса или недвижимости..." 
            className="w-full bg-slate-100 border-2 border-transparent rounded-full py-3.5 pl-6 pr-14 text-sm focus:bg-white focus:border-indigo-600 outline-none transition-all" 
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md">
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button 
            onClick={() => openModal('consult')}
            className="px-6 py-3.5 border-2 border-indigo-100 text-indigo-700 font-bold rounded-full hover:border-indigo-600 hover:bg-indigo-50 transition-all text-sm"
          >
            Привлечь инвестиции
          </button>
          <Link 
            href="/dashboard"
            className="px-6 py-3.5 bg-teal-400 text-indigo-950 font-bold rounded-full hover:bg-teal-500 transition-all shadow-lg shadow-teal-400/20 text-sm flex items-center gap-2"
          >
            <User className="w-4 h-4" /> Личный кабинет
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="hidden lg:flex bg-indigo-950 text-white px-8 py-3.5 gap-10 justify-center shadow-inner">
        {navLinks.map(link => (
          <Link key={link.name} href={link.href} className="text-xs font-bold hover:text-teal-400 transition-colors uppercase tracking-widest">
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-indigo-950 text-white overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-bold uppercase tracking-wider hover:text-teal-400"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-indigo-800 my-2" />
              <button 
                onClick={() => { setIsMobileMenuOpen(false); openModal('consult'); }}
                className="w-full py-3 border border-indigo-700 text-white font-bold rounded-xl text-sm"
              >
                Привлечь инвестиции
              </button>
              <Link 
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 bg-teal-400 text-indigo-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> Личный кабинет
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
