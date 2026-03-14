'use client';

import Link from 'next/link';
import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import { useBlogCategoriesQuery, useBlogPostsQuery } from '@/entities/content/api/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/shared/lib/format';

export default function BlogPage() {
  const postsQuery = useBlogPostsQuery();
  const categoriesQuery = useBlogCategoriesQuery();
  const posts = postsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 py-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="rounded-[32px] bg-indigo-950 text-white">
            <CardContent className="space-y-5 p-8 md:p-10">
              <div className="h-2 w-16 bg-teal-400" />
              <h1 className="text-5xl font-display font-black leading-[0.95] md:text-7xl">Блог и аналитика</h1>
              <p className="max-w-2xl text-base leading-relaxed text-indigo-100 md:text-lg">
                Рыночные обзоры, статьи по сделкам и практические материалы для инвесторов и владельцев активов.
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <span key={category.id} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-indigo-700 border border-slate-200">
                {category.name}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            {posts.map((post) => (
              <Card key={post.id} className="rounded-[32px]">
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    <span>{post.category?.name ?? 'Без категории'}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <h2 className="text-2xl font-display font-black text-indigo-950">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="inline-flex text-sm font-bold text-indigo-600">
                    Читать статью
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
