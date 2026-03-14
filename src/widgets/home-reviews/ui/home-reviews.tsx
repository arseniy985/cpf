'use client';

import { useReviewsQuery } from '@/entities/content/api/hooks';
import { Card, CardContent } from '@/components/ui/card';

export default function Reviews() {
  const reviewsQuery = useReviewsQuery();
  const reviews = (reviewsQuery.data ?? []).slice(0, 3);

  return (
    <section id="reviews" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mx-auto mb-8 h-2 w-20 bg-teal-400" />
          <h2 className="text-4xl font-display font-black text-indigo-950 md:text-6xl">Отзывы инвесторов</h2>
          <p className="mt-6 text-xl text-slate-600">
            Реальные впечатления инвесторов и клиентов о работе с платформой.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="rounded-[32px]">
              <CardContent className="space-y-4 p-8">
                <p className="text-base leading-relaxed text-slate-700">&quot;{review.body}&quot;</p>
                <div>
                  <p className="font-display text-xl font-black text-indigo-950">{review.authorName}</p>
                  <p className="text-sm text-slate-500">{review.authorRole ?? review.companyName ?? 'Клиент платформы'} · {review.rating}/5</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
