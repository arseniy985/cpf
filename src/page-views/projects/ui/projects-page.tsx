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
  getProjectCoverImage,
  projectCategoryLabels,
} from '@/entities/project';
import { useProjectsQuery } from '@/entities/project/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const budgetOptions = [
  { value: 'all', label: 'Любой вход' },
  { value: 'up_to_100k', label: 'До 100 тыс.' },
  { value: '100k_to_500k', label: '100-500 тыс.' },
  { value: '500k_plus', label: '500 тыс.+' },
];

const yieldOptions = [
  { value: 'all', label: 'Любая доходность' },
  { value: 'up_to_16', label: 'До 16%' },
  { value: '16_to_20', label: '16-20%' },
  { value: '20_plus', label: '20%+' },
];

const termOptions = [
  { value: 'all', label: 'Любой срок' },
  { value: 'up_to_12', label: 'До 12 мес.' },
  { value: '13_to_24', label: '13-24 мес.' },
  { value: '25_plus', label: '25 мес.+' },
];

export default function ProjectsPage({ initialSearch = '' }: { initialSearch?: string }) {
  const [filter, setFilter] = useState('Все');
  const [search, setSearch] = useState(initialSearch);
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [yieldFilter, setYieldFilter] = useState('all');
  const [termFilter, setTermFilter] = useState('all');
  const deferredSearch = useDeferredValue(search);
  const { data: projects = [], isPending, isError } = useProjectsQuery(deferredSearch, filter);
  const categories = useMemo(() => Object.keys(projectCategoryLabels), []);
  const visibleProjects = useMemo(
    () =>
      projects.filter((project) => {
        const budgetMatch =
          budgetFilter === 'all' ||
          (budgetFilter === 'up_to_100k' && project.minInvestment <= 100000) ||
          (budgetFilter === '100k_to_500k' && project.minInvestment > 100000 && project.minInvestment <= 500000) ||
          (budgetFilter === '500k_plus' && project.minInvestment > 500000);
        const yieldMatch =
          yieldFilter === 'all' ||
          (yieldFilter === 'up_to_16' && project.targetYield <= 16) ||
          (yieldFilter === '16_to_20' && project.targetYield > 16 && project.targetYield <= 20) ||
          (yieldFilter === '20_plus' && project.targetYield > 20);
        const termMatch =
          termFilter === 'all' ||
          (termFilter === 'up_to_12' && project.termMonths <= 12) ||
          (termFilter === '13_to_24' && project.termMonths > 12 && project.termMonths <= 24) ||
          (termFilter === '25_plus' && project.termMonths > 24);

        return budgetMatch && yieldMatch && termMatch;
      }),
    [projects, budgetFilter, yieldFilter, termFilter],
  );

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
                  <span className="text-teal-300">проектов</span>
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-indigo-100 md:text-lg">
                  Отфильтруйте предложения по размеру входа, доходности и сроку, затем откройте карточку проекта и перейдите в реальный инвестиционный сценарий.
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
                    <p className="text-xs text-slate-500">Используйте название, район или знакомый ориентир по проекту.</p>
                  </div>
                </div>
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Название или ориентир проекта…"
                  className="rounded-2xl bg-slate-50"
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
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

            <FilterRow
              label="Размер входа"
              options={budgetOptions}
              value={budgetFilter}
              onChange={setBudgetFilter}
            />
            <FilterRow
              label="Доходность"
              options={yieldOptions}
              value={yieldFilter}
              onChange={setYieldFilter}
            />
            <FilterRow
              label="Срок"
              options={termOptions}
              value={termFilter}
              onChange={setTermFilter}
            />
          </div>

          {isPending ? <Card className="mt-8"><CardContent className="p-6 text-slate-500">Загружаем проекты...</CardContent></Card> : null}
          {isError ? <Card className="mt-8"><CardContent className="p-6 text-amber-700">Сейчас не удалось обновить список. Попробуйте еще раз чуть позже.</CardContent></Card> : null}

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden rounded-[32px]">
                <div className="relative h-64 border-b border-slate-200">
                  <Image
                    src={getProjectCoverImage(project.coverImageUrl)}
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

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="flex-1">
                      <Link href={`/projects/${project.slug}#invest`}>
                        Инвестировать
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/projects/${project.slug}`}>
                        Подробнее <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!isPending && visibleProjects.length === 0 ? (
            <div className="mt-8 rounded-[32px] border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
              По выбранным параметрам проектов пока нет. Сбросьте один из фильтров или откройте калькулятор для подбора сценария.
            </div>
          ) : null}
        </section>
      </div>
      <Footer />
    </main>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 border border-slate-200">
        {label}
      </div>
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => onChange(option.value)}
          variant={value === option.value ? 'default' : 'outline'}
          className={`rounded-full px-5 ${
            value === option.value
              ? 'text-indigo-950'
              : 'text-slate-600 hover:border-indigo-300'
          }`}
        >
          {option.label}
        </Button>
      ))}
    </div>
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
