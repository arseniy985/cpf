import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, MapPin, ShieldAlert, TrendingUp } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { getProjectById, projects } from '@/lib/domain/projects';

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id }));
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-10 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/projects" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
            ← Назад к проектам
          </Link>

          <h1 className="mt-6 text-4xl md:text-6xl font-display font-black text-indigo-950 tracking-tight">{project.title}</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl">{project.shortDescription}</p>

          <div className="mt-10 grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="relative h-[420px] rounded-[32px] overflow-hidden border border-slate-200">
                <Image src={project.image} alt={project.title} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>

              <div className="mt-8 bg-white border border-slate-200 rounded-[32px] p-8">
                <h2 className="text-2xl font-display font-bold text-indigo-950">Описание проекта</h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  [Подробное описание проекта, финансовой модели, структуры владения и плана управления объектом.]
                </p>
              </div>

              <div className="mt-6 bg-white border border-slate-200 rounded-[32px] p-8">
                <h2 className="text-2xl font-display font-bold text-indigo-950">Документы проекта</h2>
                <div className="mt-5 space-y-3">
                  {['[Инвестиционный меморандум]', '[Юридическое заключение]', '[Финансовая модель]'].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <span className="font-medium text-slate-700">{doc}</span>
                      <button className="px-4 py-2 rounded-full bg-white border border-slate-200 font-bold text-sm text-indigo-700 hover:border-indigo-300 transition-colors">
                        Скачать
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 sticky top-24">
                <h2 className="text-2xl font-display font-bold text-indigo-950">Параметры</h2>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-500">Доходность</span>
                    <span className="font-bold text-indigo-600 inline-flex items-center gap-1"><TrendingUp className="w-4 h-4" /> {project.yield}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-500">Срок</span>
                    <span className="font-bold text-indigo-950 inline-flex items-center gap-1"><Clock className="w-4 h-4" /> {project.term}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-500">Локация</span>
                    <span className="font-bold text-indigo-950 inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {project.location}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-500">Мин. сумма</span>
                    <span className="font-bold text-indigo-950">{project.minInvestment}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-slate-500">Уровень риска</span>
                    <span className="font-bold text-indigo-950 inline-flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> {project.riskLevel}</span>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Link href="/register" className="block w-full text-center bg-teal-400 text-indigo-950 font-bold py-4 rounded-2xl hover:bg-teal-500 transition-colors">
                    Инвестировать
                  </Link>
                  <Link href="/calculator" className="block w-full text-center bg-indigo-950 text-white font-bold py-4 rounded-2xl hover:bg-indigo-800 transition-colors">
                    Рассчитать доход
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
