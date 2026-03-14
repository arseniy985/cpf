'use client';

import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import { useBlogPostQuery } from '@/entities/content/api/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/shared/lib/format';

export function BlogPostPage({ slug }: { slug: string }) {
  const postQuery = useBlogPostQuery(slug);
  const post = postQuery.data;

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 py-12">
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="rounded-[32px]">
            <CardContent className="space-y-5 p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                {post?.category?.name ?? 'Блог'} · {formatDate(post?.publishedAt ?? null)}
              </p>
              <h1 className="text-4xl font-display font-black text-indigo-950 md:text-6xl">{post?.title ?? 'Загружаем статью...'}</h1>
              <p className="text-lg leading-relaxed text-slate-600">{post?.excerpt}</p>
              <div className="prose prose-slate max-w-none whitespace-pre-line text-base leading-8 text-slate-700">
                {post?.body}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      <Footer />
    </main>
  );
}
