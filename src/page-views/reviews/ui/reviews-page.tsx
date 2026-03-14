'use client';

import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import { useCaseStudiesQuery, useReviewsQuery } from '@/entities/content/api/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/shared/lib/format';

export default function ReviewsPage() {
  const reviewsQuery = useReviewsQuery();
  const caseStudiesQuery = useCaseStudiesQuery();
  const reviews = reviewsQuery.data ?? [];
  const caseStudies = caseStudiesQuery.data ?? [];

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 py-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="rounded-[32px] bg-indigo-950 text-white">
              <CardContent className="space-y-5 p-8 md:p-10">
                <div className="h-2 w-16 bg-teal-400" />
                <h1 className="text-5xl font-display font-black leading-[0.95] md:text-7xl">
                  Отзывы и
                  <br />
                  <span className="text-teal-300">кейсы</span>
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-indigo-100 md:text-lg">
                  Истории клиентов, результаты сопровождения и отзывы о работе с платформой.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <Card className="rounded-[32px]">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-2xl font-display font-black text-indigo-950">Отзывы клиентов</h2>
                {reviews.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-base leading-relaxed text-slate-700">{item.body}</p>
                    <p className="mt-4 font-display text-xl font-bold text-indigo-950">{item.authorName}</p>
                    <p className="text-sm text-slate-500">{item.authorRole ?? item.companyName ?? 'Клиент платформы'} · {item.rating}/5</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[32px]">
              <CardContent className="space-y-4 p-6">
                <h2 className="text-2xl font-display font-black text-indigo-950">Кейсы</h2>
                {caseStudies.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">{formatDate(item.publishedAt)}</p>
                    <h3 className="mt-2 text-xl font-display font-bold text-indigo-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.excerpt}</p>
                    <p className="mt-3 text-sm text-slate-700">{item.body}</p>
                    {item.resultMetric ? <p className="mt-4 font-bold text-teal-700">{item.resultMetric}</p> : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
