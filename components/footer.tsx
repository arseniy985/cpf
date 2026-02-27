'use client';

import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-indigo-950 text-indigo-200 py-20 border-t border-indigo-900 relative overflow-hidden">
      {/* Asymmetrical bg shapes */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-indigo-900 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group text-white">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-teal-400 group-hover:text-indigo-950 transition-all duration-300 transform group-hover:-rotate-6">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl leading-none tracking-wider">ЦПФ</span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">Инвестиции</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-indigo-300 max-w-sm">
              Центр Партнёрского Финансирования. Инновационная платформа коллективных инвестиций в коммерческую недвижимость и готовый бизнес.
            </p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-modal', { detail: { type: 'consult' } }))}
              className="inline-flex items-center gap-2 text-teal-400 font-bold hover:text-teal-300 transition-colors group"
            >
              Бесплатная консультация <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-display font-bold mb-6 uppercase tracking-wider text-sm">Навигация</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/about" className="hover:text-teal-400 transition-colors">О компании</Link></li>
              <li><Link href="/projects" className="hover:text-teal-400 transition-colors">Каталог активов</Link></li>
              <li><Link href="/services" className="hover:text-teal-400 transition-colors">Услуги</Link></li>
              <li><Link href="/blog" className="hover:text-teal-400 transition-colors">Блог и аналитика</Link></li>
              <li><Link href="/career" className="hover:text-teal-400 transition-colors">Карьера</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-display font-bold mb-6 uppercase tracking-wider text-sm">Документы</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Правила платформы</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Декларация о рисках</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Пользовательское соглашение</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-display font-bold mb-6 uppercase tracking-wider text-sm">Контакты</h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center shrink-0 group-hover:bg-teal-400 group-hover:text-indigo-950 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <a href="tel:+74951369888" className="block text-white font-bold hover:text-teal-400 transition-colors text-base">+7 (495) 136-98-88</a>
                  <span className="text-xs text-indigo-400">Пн-Вс 9:00 - 21:00</span>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center shrink-0 group-hover:bg-teal-400 group-hover:text-indigo-950 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:invest@cpf.ru" className="font-medium hover:text-teal-400 transition-colors">invest@cpf.ru</a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center shrink-0 group-hover:bg-teal-400 group-hover:text-indigo-950 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-medium leading-relaxed">г. Москва, Пресненская наб., 12<br/>Башня Федерация</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-indigo-900/50 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-indigo-400">
          <p>© {new Date().getFullYear()} ООО «ЦПФ». Все права защищены.</p>
          <p className="text-center md:text-right max-w-2xl leading-relaxed">
            Инвестирование сопряжено с риском потери части или всех инвестированных средств. Предлагаемые услуги не являются банковским вкладом и не застрахованы в АСВ.
          </p>
        </div>
      </div>
    </footer>
  );
}
