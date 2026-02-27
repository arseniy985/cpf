'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';

export default function ContactsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Info */}
            <div className="relative">
              <div className="absolute -left-20 top-0 text-[12vw] font-display font-black text-slate-200/50 leading-none pointer-events-none select-none -z-10">
                СВЯЗЬ
              </div>
              <div className="w-16 h-2 bg-teal-400 mb-8"></div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 mb-12 tracking-tighter">
                ОСТАЛИСЬ <br/> ВОПРОСЫ?
              </h1>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Phone className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Телефон</p>
                    <a href="tel:+74951369888" className="text-3xl font-display font-bold text-indigo-950 hover:text-indigo-600 transition-colors">+7 (495) 136-98-88</a>
                    <p className="text-slate-600 mt-2">Ежедневно с 9:00 до 21:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Офис</p>
                    <p className="text-2xl font-display font-bold text-indigo-950">г. Москва, Пресненская наб., 12</p>
                    <p className="text-slate-600 mt-2">ММДЦ «Москва-Сити», Башня Федерация</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Mail className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Email</p>
                    <a href="mailto:invest@cpf.ru" className="text-2xl font-display font-bold text-indigo-950 hover:text-indigo-600 transition-colors">invest@cpf.ru</a>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-4 rounded-full font-bold hover:bg-blue-100 transition-colors">
                  <Send className="w-5 h-5" /> Telegram
                </button>
                <button className="flex items-center gap-2 bg-green-50 text-green-600 px-6 py-4 rounded-full font-bold hover:bg-green-100 transition-colors">
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </button>
              </div>
            </div>

            {/* Right Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              className="bg-indigo-950 rounded-[40px] p-10 md:p-14 relative overflow-hidden shadow-2xl shadow-indigo-900/20"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-3xl font-display font-bold text-white mb-4">Напишите нам</h3>
              <p className="text-indigo-200 mb-10">Мы свяжемся с вами в течение 15 минут в рабочее время.</p>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-indigo-300 mb-2 ml-1">Ваше имя</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-indigo-900/50 border border-indigo-800 rounded-2xl focus:outline-none focus:border-teal-400 text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-indigo-300 mb-2 ml-1">Телефон</label>
                  <input 
                    type="tel" 
                    className="w-full px-5 py-4 bg-indigo-900/50 border border-indigo-800 rounded-2xl focus:outline-none focus:border-teal-400 text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-indigo-300 mb-2 ml-1">Сообщение</label>
                  <textarea 
                    rows={4}
                    className="w-full px-5 py-4 bg-indigo-900/50 border border-indigo-800 rounded-2xl focus:outline-none focus:border-teal-400 text-white transition-all resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="button"
                  className="w-full bg-teal-400 text-indigo-950 font-bold py-5 rounded-2xl hover:bg-teal-500 transition-colors shadow-xl shadow-teal-400/20 text-lg mt-4"
                >
                  Отправить сообщение
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
