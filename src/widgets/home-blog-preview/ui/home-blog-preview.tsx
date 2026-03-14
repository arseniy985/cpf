'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useBlogPostsQuery } from '@/entities/content/api/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/shared/lib/format';

export default function BlogPreview() {
  const blogPostsQuery = useBlogPostsQuery();
  const posts = (blogPostsQuery.data ?? []).slice(0, 3);

  return (
    <section className="border-t border-slate-100 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-6 h-2 w-16 bg-indigo-600" />
            <h2 className="text-4xl font-display font-black text-indigo-950 md:text-5xl">Блог и аналитика</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Свежие материалы о рынке, сделках и подходах к частным инвестициям.
            </p>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Все статьи <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="rounded-[32px]">
              <CardContent className="space-y-4 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                  {post.category?.name ?? 'Блог'} · {formatDate(post.publishedAt)}
                </p>
                <h3 className="text-2xl font-display font-black text-indigo-950">{post.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600">
                  Читать статью <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
