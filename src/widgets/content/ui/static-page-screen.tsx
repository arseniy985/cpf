'use client';

import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import { useStaticPageQuery } from '@/entities/content/api/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function StaticPageScreen({
  pageKey,
  ctaHref,
  ctaLabel,
}: {
  pageKey: 'about' | 'how-it-works' | 'contacts';
  ctaHref: string;
  ctaLabel: string;
}) {
  const pageQuery = useStaticPageQuery(pageKey);
  const page = pageQuery.data;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 py-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="rounded-[32px] bg-indigo-950 text-white">
              <CardContent className="space-y-6 p-8 md:p-10">
                <div className="h-2 w-16 bg-teal-400" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">ЦПФ инвестиции</p>
                <h1 className="text-4xl font-display font-black leading-tight md:text-6xl">
                  {page?.headline ?? 'Загружаем страницу...'}
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-indigo-100 md:text-lg">
                  {page?.summary ?? 'Здесь появится краткое описание страницы.'}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[32px]">
              <CardContent className="space-y-5 p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Кратко о странице</p>
                <h2 className="text-3xl font-display font-black text-indigo-950">{page?.title ?? 'Информация обновляется'}</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Здесь собрана основная информация и быстрый переход к следующему шагу.
                </p>
                <Button asChild variant="secondary">
                  <a href={ctaHref}>{ctaLabel}</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-[32px]">
              <CardContent className="p-8">
                <div className="whitespace-pre-line text-base leading-8 text-slate-700">
                  {pageQuery.isPending
                    ? 'Загружаем содержимое страницы...'
                    : page?.body ?? 'Материал для этой страницы скоро появится.'}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-[32px]">
                <CardContent className="space-y-3 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Состояние страницы</p>
                  <p className="text-2xl font-display font-black text-indigo-950">{pageQuery.isError ? 'Временно недоступно' : 'Данные актуальны'}</p>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Если информация на странице обновится, изменения появятся здесь автоматически.
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[32px]">
                <CardContent className="space-y-3 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Дополнительная информация</p>
                  <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                    {JSON.stringify(page?.meta ?? {}, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
