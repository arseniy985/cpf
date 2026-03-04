import Header from '@/components/header';
import Footer from '@/components/footer';
import { Quote, ShieldCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const cases = [
  {
    title: '[Кейс: формат сделки]',
    segment: 'Частный инвестор',
    task: '[Цель клиента]',
    decision: '[Принятое финансовое решение]',
    result: '[Результат в метрике/сроке]',
  },
  {
    title: '[Кейс: коммерческий объект]',
    segment: 'Партнерский проект',
    task: '[Задача партнера]',
    decision: '[Структура финансирования]',
    result: '[Фактический эффект]',
  },
  {
    title: '[Кейс: диверсификация]',
    segment: 'Семейный капитал',
    task: '[Запрос на снижение риска]',
    decision: '[Комбинация активов]',
    result: '[Достижение цели]',
  },
];

const testimonials = [
  {
    quote: '[Отзыв инвестора о процессе и прозрачности]',
    author: '[Имя Фамилия]',
    role: '[Статус инвестора]',
  },
  {
    quote: '[Отзыв о качестве сопровождения и отчетности]',
    author: '[Имя Фамилия]',
    role: '[Партнер/инвестор]',
  },
  {
    quote: '[Отзыв о скорости запуска сделки]',
    author: '[Имя Фамилия]',
    role: '[Клиент ЦПФ]',
  },
];

export default function ReviewsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-2 bg-teal-400 mb-6"></div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 tracking-tighter leading-[1]">
            ОТЗЫВЫ И <span className="text-indigo-600">КЕЙСЫ</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-3xl leading-relaxed">
            Раздел доверия: реальные сценарии сотрудничества, структура принятых решений и подтвержденная прозрачность
            процессов.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8 bg-white border border-slate-200 rounded-[32px] p-8">
            <h2 className="text-3xl font-display font-bold text-indigo-950">Кейсы</h2>
            <div className="mt-7 space-y-5">
              {cases.map((item) => (
                <article key={item.title} className="p-6 rounded-[24px] bg-slate-50 border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-2xl font-display font-bold text-indigo-950">{item.title}</h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">{item.segment}</span>
                  </div>
                  <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-white border border-slate-100">
                      <p className="font-bold text-slate-500 uppercase tracking-wider text-xs">Задача</p>
                      <p className="mt-2 text-slate-700">{item.task}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-100">
                      <p className="font-bold text-slate-500 uppercase tracking-wider text-xs">Решение</p>
                      <p className="mt-2 text-slate-700">{item.decision}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-100">
                      <p className="font-bold text-slate-500 uppercase tracking-wider text-xs">Результат</p>
                      <p className="mt-2 text-slate-700">{item.result}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="lg:col-span-4 bg-indigo-950 text-white rounded-[32px] p-8">
            <h2 className="text-2xl font-display font-bold">Почему этот раздел важен</h2>
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-900/60 border border-indigo-800 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-400 mt-0.5" />
                <p className="text-indigo-200 text-sm">Показывает не обещания, а структуру принятия решений и контроль рисков.</p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-900/60 border border-indigo-800 flex gap-3">
                <TrendingUp className="w-5 h-5 text-teal-400 mt-0.5" />
                <p className="text-indigo-200 text-sm">Фокус на процессе, который приводит к результату, а не только на финальной цифре.</p>
              </div>
            </div>
            <Link href="/contacts" className="mt-6 inline-flex w-full items-center justify-center px-6 py-4 rounded-2xl bg-teal-400 text-indigo-950 font-bold hover:bg-teal-500 transition-colors">
              Обсудить свой кейс
            </Link>
          </article>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <article key={item.quote} className="bg-white border border-slate-200 rounded-[28px] p-6">
                <Quote className="w-8 h-8 text-indigo-300" />
                <p className="mt-4 text-slate-700 leading-relaxed">{item.quote}</p>
                <p className="mt-5 font-display font-bold text-indigo-950">{item.author}</p>
                <p className="text-sm text-slate-500">{item.role}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
