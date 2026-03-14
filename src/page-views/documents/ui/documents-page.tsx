'use client';

import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import { Download, FileText, ShieldCheck } from 'lucide-react';
import { useLegalDocumentsQuery } from '@/entities/content/api/hooks';

export default function DocumentsPage() {
  const documentsQuery = useLegalDocumentsQuery();

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-2 bg-teal-400 mb-6"></div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 tracking-tighter leading-[1]">
            ДОКУМЕНТЫ <span className="text-indigo-600">ПЛАТФОРМЫ</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl">
            Раздел прозрачности: ключевые юридические документы и раскрытие рисков.
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {(documentsQuery.data ?? []).map((doc) => (
              <article key={doc.id} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-indigo-950">{doc.title}</h2>
                      <p className="mt-2 text-slate-500 text-sm">{doc.summary ?? doc.documentType}</p>
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4" /> PDF
                  </a>
                </div>
              </article>
            ))}
          </div>

          {documentsQuery.isPending && (
            <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6 text-sm text-slate-500">
              Загружаем юридические документы...
            </div>
          )}

          <div className="mt-12 bg-indigo-950 rounded-[32px] p-8 text-white flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-teal-400 shrink-0 mt-1" />
            <p className="text-indigo-200 leading-relaxed">
              Перед инвестированием внимательно изучите документы и условия участия. При необходимости запросите консультацию специалиста.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
