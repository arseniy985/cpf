'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Filter, MapPin, Search, TrendingUp } from 'lucide-react';
import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import {
  formatProjectMoney,
  formatProjectTerm,
  formatProjectYield,
  getProjectCategoryLabel,
  projectCategoryLabels,
} from '@/entities/project';
import { useProjectsQuery } from '@/entities/project/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ProjectsPage({ initialSearch = '' }: { initialSearch?: string }) {
  const [filter, setFilter] = useState('Все');
  const [search, setSearch] = useState(initialSearch);
  const deferredSearch = useDeferredValue(search);
  const { data: projects = [], isPending, isError } = useProjectsQuery(deferredSearch, filter);
  const categories = useMemo(() => Object.keys(projectCategoryLabels), []);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-20">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="rounded-[32px] bg-indigo-950 text-white">
              <CardContent className="space-y-5 p-8 md:p-10">
                <div className="h-2 w-16 bg-teal-400" />
                <h1 className="text-5xl font-display font-black leading-[0.95] md:text-7xl">
                  Каталог
                  <br />
                  <span className="text-teal-300">активов</span>
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-indigo-100 md:text-lg">
                  Подборка инвестиционных проектов с понятной структурой сделки, сроками и ожидаемой доходностью.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[32px]">
              <CardContent className="space-y-4 p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-indigo-950">Поиск по проектам</p>
                    <p className="text-xs text-slate-500">Используйте поиск и категории, чтобы быстрее найти подходящий актив.</p>
                  </div>
                </div>
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Название проекта"
                  className="rounded-2xl bg-slate-50"
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-indigo-950 px-4 py-3 text-sm font-bold text-white">
              <Filter className="h-4 w-4" /> Категории
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setFilter(category)}
                variant={filter === category ? 'default' : 'outline'}
                className={`rounded-full px-5 ${
                  filter === category
                    ? 'text-indigo-950'
                    : 'text-slate-600 hover:border-indigo-300'
                }`}
              >
                {projectCategoryLabels[category]}
              </Button>
            ))}
          </div>

          {isPending ? <Card className="mt-8"><CardContent className="p-6 text-slate-500">Загружаем проекты...</CardContent></Card> : null}
          {isError ? <Card className="mt-8"><CardContent className="p-6 text-amber-700">Сейчас не удалось обновить список. Попробуйте еще раз чуть позже.</CardContent></Card> : null}

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden rounded-[32px]">
                <div className="relative h-64 border-b border-slate-200">
                  <Image
                    src={project.coverImageUrl ?? 'https://picsum.photos/seed/project-card/1200/800'}
                    alt={project.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <CardContent className="space-y-5 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
                      {getProjectCategoryLabel(project.assetType)}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{project.fundingProgress}% собрано</span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-display font-bold text-indigo-950">{project.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{project.excerpt}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Metric label="Доходность" value={formatProjectYield(project.targetYield)} icon={<TrendingUp className="h-4 w-4" />} />
                    <Metric label="Срок" value={formatProjectTerm(project.termMonths)} icon={<Clock className="h-4 w-4" />} />
                    <Metric label="Локация" value={project.location} icon={<MapPin className="h-4 w-4" />} />
                    <Metric label="Мин. вход" value={formatProjectMoney(project.minInvestment)} />
                  </div>

                  <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600">
                    Открыть карточку <ArrowRight className="h-4 w-4" />
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

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 flex items-center gap-1 text-sm font-bold text-indigo-950">{icon}{value}</p>
    </div>
  );
}
