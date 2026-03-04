import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-[40px] p-10 md:p-12 shadow-xl shadow-indigo-900/5">
            <div className="w-16 h-2 bg-teal-400 mb-6"></div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-indigo-950 tracking-tight">РЕГИСТРАЦИЯ</h1>
            <p className="mt-4 text-slate-600">Создайте аккаунт, чтобы инвестировать и отслеживать результаты в личном кабинете.</p>

            <form className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-indigo-950 mb-2 ml-1">Имя и фамилия</label>
                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-950 mb-2 ml-1">Email</label>
                <input type="email" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-950 mb-2 ml-1">Телефон</label>
                <input type="tel" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-indigo-950 mb-2 ml-1">Пароль</label>
                <input type="password" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all" />
              </div>

              <button type="button" className="w-full bg-teal-400 text-indigo-950 font-bold py-4 rounded-2xl hover:bg-teal-500 transition-colors">
                Создать аккаунт
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
