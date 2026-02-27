'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Briefcase, History, FileText, Settings, CreditCard, ArrowDownToLine, ArrowUpRight, CheckCircle2, Wallet, Building2, Bell, LogOut, Menu, X, Download, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { id: 'overview', name: 'Дашборд', icon: LayoutDashboard },
  { id: 'projects', name: 'Мои проекты', icon: Briefcase },
  { id: 'history', name: 'История операций', icon: History },
  { id: 'documents', name: 'Документы', icon: FileText },
  { id: 'deposit', name: 'Пополнение', icon: CreditCard },
  { id: 'withdraw', name: 'Вывод средств', icon: ArrowDownToLine },
  { id: 'settings', name: 'Настройки', icon: Settings },
];

const mockProjects = [
  { id: 1, name: 'Торговый центр "Галерея"', invested: 500000, date: '12.01.2026', term: '36 мес', yield: '22.5%', received: 112500, remaining: 225000 },
  { id: 2, name: 'Складской комплекс А+', invested: 100000, date: '05.11.2025', term: '24 мес', yield: '19.8%', received: 33000, remaining: 66000 },
];

const mockHistory = [
  { id: 1, date: '20.02.2026', type: 'Доход', project: 'ТЦ "Галерея"', amount: '+ 9 375 ₽', status: 'Успешно', color: 'text-emerald-600' },
  { id: 2, date: '05.02.2026', type: 'Доход', project: 'Склад А+', amount: '+ 1 650 ₽', status: 'Успешно', color: 'text-emerald-600' },
  { id: 3, date: '12.01.2026', type: 'Инвестиция', project: 'ТЦ "Галерея"', amount: '- 500 000 ₽', status: 'Успешно', color: 'text-slate-900' },
  { id: 4, date: '10.01.2026', type: 'Пополнение', project: 'Онлайн-касса', amount: '+ 500 000 ₽', status: 'Успешно', color: 'text-emerald-600' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-3 flex justify-between items-center sticky top-0 z-50 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          <span className="font-display font-bold text-base tracking-wider uppercase">ЦПФ</span>
        </Link>
        <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="p-1">
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileNavOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ duration: 0.2 }}
            className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col z-40 border-r border-slate-800 ${isMobileNavOpen ? 'block' : 'hidden md:flex'}`}
          >
            <div className="p-5 hidden md:block border-b border-slate-800">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white group-hover:bg-blue-500 transition-colors">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-display font-bold text-lg tracking-wider uppercase text-white">ЦПФ</span>
              </Link>
            </div>

            <div className="p-5 border-b border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-800 rounded overflow-hidden relative border border-slate-700">
                  <Image src="https://picsum.photos/seed/user/100/100" alt="User" fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">Иван Иванов</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">ID: 49201</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Верифицирован
              </div>
            </div>

            <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileNavOpen(false); }}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all border-l-2 ${
                    activeTab === item.id 
                      ? 'bg-slate-800 text-blue-400 border-blue-500' 
                      : 'border-transparent hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white rounded transition-all">
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Topbar */}
        <header className="hidden md:flex items-center justify-between bg-white px-6 py-3 border-b border-slate-200 sticky top-0 z-30">
          <h2 className="text-lg font-display font-bold text-slate-900 uppercase tracking-wider">
            {navItems.find(i => i.id === activeTab)?.name}
          </h2>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors p-1">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></span>
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <Link href="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Перейти в каталог
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-6 flex-1">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="space-y-6">
                
                {/* Balance Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-900 p-5 rounded-md text-white border border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Доступный баланс</p>
                      <p className="text-3xl font-mono font-bold mb-4">145 000 ₽</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setActiveTab('deposit')} className="flex-1 bg-blue-600 text-white py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors text-center">
                        Пополнить
                      </button>
                      <button onClick={() => setActiveTab('withdraw')} className="flex-1 bg-slate-800 text-white py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-colors text-center border border-slate-700">
                        Вывести
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-600">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Инвестировано всего</p>
                    </div>
                    <p className="text-2xl font-mono font-bold text-slate-900">600 000 ₽</p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center text-blue-600">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ожидаемые выплаты</p>
                    </div>
                    <p className="text-2xl font-mono font-bold text-slate-900">291 000 ₽</p>
                  </div>
                </div>

                {/* Active Projects & History */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-md border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 rounded-t-md">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Активные проекты</h3>
                      <button onClick={() => setActiveTab('projects')} className="text-xs font-medium text-blue-600 hover:text-blue-800">Все</button>
                    </div>
                    <div className="p-4 space-y-3 flex-1">
                      {mockProjects.map(p => (
                        <div key={p.id} className="p-3 border border-slate-200 rounded bg-white flex items-center justify-between group hover:border-blue-300 transition-colors cursor-pointer">
                          <div>
                            <p className="font-bold text-sm text-slate-900 mb-0.5">{p.name}</p>
                            <p className="text-xs text-slate-500 font-mono">{p.invested.toLocaleString('ru-RU')} ₽ • Доходность {p.yield}</p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-md border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 rounded-t-md">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Последние операции</h3>
                      <button onClick={() => setActiveTab('history')} className="text-xs font-medium text-blue-600 hover:text-blue-800">Все</button>
                    </div>
                    <div className="p-0 flex-1">
                      {mockHistory.slice(0,4).map(h => (
                        <div key={h.id} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded flex items-center justify-center border ${h.type === 'Доход' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : h.type === 'Пополнение' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                              {h.type === 'Доход' ? <TrendingUp className="w-3.5 h-3.5" /> : h.type === 'Пополнение' ? <Wallet className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-slate-900">{h.type}</p>
                              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{h.date} • {h.project}</p>
                            </div>
                          </div>
                          <div className={`font-mono font-bold text-xs ${h.color}`}>{h.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <motion.div key="projects" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="space-y-4">
                {mockProjects.map(p => (
                  <div key={p.id} className="bg-white p-5 rounded-md border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{p.name}</h3>
                        <p className="text-xs text-slate-500 font-mono">Дата входа: {p.date} • Срок: {p.term}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Сумма инвестиций</p>
                        <p className="text-xl font-mono font-bold text-slate-900">{p.invested.toLocaleString('ru-RU')} ₽</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                      <div className="bg-slate-50 p-3 rounded border border-slate-200">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Доходность</p>
                        <p className="text-sm font-bold text-blue-600 font-mono">{p.yield}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded border border-slate-200">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Уже получено</p>
                        <p className="text-sm font-bold text-emerald-600 font-mono">{p.received.toLocaleString('ru-RU')} ₽</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded border border-slate-200">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Осталось получить</p>
                        <p className="text-sm font-bold text-slate-900 font-mono">{p.remaining.toLocaleString('ru-RU')} ₽</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <button className="w-full bg-white border border-slate-300 text-slate-700 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center gap-2">
                          <FileText className="w-3.5 h-3.5" /> Документы
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">История операций</h3>
                  <button className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-wider border border-slate-300 rounded px-3 py-1.5 bg-white hover:bg-slate-50 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Экспорт
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-200">
                        <th className="p-4 font-bold">Дата</th>
                        <th className="p-4 font-bold">Тип</th>
                        <th className="p-4 font-bold">Проект / Назначение</th>
                        <th className="p-4 font-bold">Сумма</th>
                        <th className="p-4 font-bold">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockHistory.map((h) => (
                        <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4 text-xs font-mono text-slate-600">{h.date}</td>
                          <td className="p-4 text-xs font-bold text-slate-900">{h.type}</td>
                          <td className="p-4 text-xs text-slate-600">{h.project}</td>
                          <td className={`p-4 text-xs font-mono font-bold ${h.color}`}>{h.amount}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-3 h-3" /> {h.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* PLACEHOLDERS (Deposit, Withdraw, Documents, Settings) */}
            {['deposit', 'withdraw', 'documents', 'settings'].includes(activeTab) && (
              <motion.div key="placeholder" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="bg-white p-12 rounded-md border border-slate-200 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded flex items-center justify-center mx-auto mb-4 text-slate-400">
                  {activeTab === 'deposit' && <CreditCard className="w-6 h-6" />}
                  {activeTab === 'withdraw' && <ArrowDownToLine className="w-6 h-6" />}
                  {activeTab === 'documents' && <FileText className="w-6 h-6" />}
                  {activeTab === 'settings' && <Settings className="w-6 h-6" />}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Раздел в разработке</h3>
                <p className="text-slate-500 text-xs">
                  Здесь будет доступен функционал{' '}
                  {activeTab === 'deposit' && 'пополнения баланса'}
                  {activeTab === 'withdraw' && 'вывода средств'}
                  {activeTab === 'documents' && 'документооборота'}
                  {activeTab === 'settings' && 'настроек профиля'}.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
