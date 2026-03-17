import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: '404 | ЦПФ',
  description: 'Запрошенная страница не найдена.',
};

export default function GlobalNotFound() {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="bg-slate-50 font-sans text-slate-900 antialiased">
        <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <section className="w-full max-w-3xl border border-slate-200 bg-white px-6 py-8 sm:px-10 sm:py-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Ошибка маршрута
            </p>
            <h1 className="mt-4 max-w-2xl text-balance text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Страница не найдена
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-slate-600">
              Проверьте адрес или вернитесь в рабочий кабинет и каталог проектов.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex h-11 items-center justify-center border border-[#0E2A47] bg-[#0E2A47] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#12365a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FAEE3] focus-visible:ring-offset-2"
              >
                Открыть кабинет
              </Link>
              <Link
                href="/projects"
                className="inline-flex h-11 items-center justify-center border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5FAEE3] focus-visible:ring-offset-2"
              >
                Перейти к проектам
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
