'use client';

import { type ReactNode, useDeferredValue, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock3, MapPin, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectsQuery } from '@/entities/project/api/hooks';
import {
  formatProjectMoney,
  formatProjectTerm,
  formatProjectYield,
  getProjectCategoryLabel,
  projectCategoryLabels,
} from '@/entities/project';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

const budgetOptions = [
  { value: 'all', label: 'Любой вход' },
  { value: 'up_to_100k', label: 'До 100 тыс.' },
  { value: '100k_to_500k', label: '100-500 тыс.' },
  { value: '500k_plus', label: 'От 500 тыс.' },
] as const;

const yieldOptions = [
  { value: 'all', label: 'Любая доходность' },
  { value: 'up_to_16', label: 'До 16%' },
  { value: '16_to_20', label: '16-20%' },
  { value: '20_plus', label: 'От 20%' },
] as const;

export default function AppProjectCatalogPage() {
  const [category, setCategory] = useState('Все');
  const [search, setSearch] = useState('');
  const [budgetFilter, setBudgetFilter] = useState<(typeof budgetOptions)[number]['value']>('all');
  const [yieldFilter, setYieldFilter] = useState<(typeof yieldOptions)[number]['value']>('all');
  const deferredSearch = useDeferredValue(search);
  const { data: projects = [], isPending, isError } = useProjectsQuery(deferredSearch, category);
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

        return budgetMatch && yieldMatch;
      }),
    [budgetFilter, projects, yieldFilter],
  );
  const featuredProject = visibleProjects[0];

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Кабинет инвестора"
        title="Каталог проектов"
        description="Подбор проектов по размеру входа, доходности и типу актива без выхода из кабинета."
      />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#102a5d_0%,#173b79_52%,#d4e7ff_160%)] text-white shadow-[0_24px_70px_rgba(16,42,93,0.22)]">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Подбор под ваш сценарий</p>
              <h2 className="max-w-xl text-3xl font-bold leading-tight text-balance sm:text-4xl">
                Сильные проекты с понятной экономикой и прозрачной точкой входа.
              </h2>
              <p className="max-w-xl text-sm leading-6 text-white/78 sm:text-base">
                Смотрите структуру сделки, текущий прогресс сбора, доходность и срок. Дальше можно сразу перейти в карточку проекта и к сценарию инвестирования.
              </p>
            </div>
            <div className="grid gap-3 self-end sm:grid-cols-2 lg:grid-cols-1">
              <MetricCard label="В каталоге" value={`${visibleProjects.length}`} note="актуальных предложений" />
              <MetricCard
                label="Фокус недели"
                value={featuredProject ? formatProjectYield(featuredProject.targetYield) : '0%'}
                note={featuredProject ? featuredProject.title : 'Проекты подгружаются'}
              />
            </div>
          </div>
        </div>

        <AppSurface
          eyebrow="Быстрый поиск"
          title="Найдите проект по названию или локации"
          description="Поиск срабатывает сразу по мере ввода, а фильтры ниже сужают выбор по параметрам сделки."
          tone="secondary"
        >
          <div className="space-y-4">
            <label className="block">
              <span className="sr-only">Поиск проекта</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" aria-hidden="true" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Название, район или ориентир проекта…"
                  className="h-12 rounded-full border-app-cabinet-border bg-white pl-11"
                />
              </div>
            </label>
            <div className="rounded-[1.5rem] border border-app-cabinet-border bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text-muted">Что важно сейчас</p>
              <p className="mt-2 text-sm leading-6 text-brand-text">
                Выберите тип актива, затем ограничьте вход и доходность. Так каталог быстро сойдётся к реальным сценариям инвестирования.
              </p>
            </div>
          </div>
        </AppSurface>
      </section>

      <AppSurface
        eyebrow="Фильтры"
        title="Соберите короткий список"
        description="Оставьте только те проекты, которые подходят по типу актива и параметрам сделки."
        tone="secondary"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <Button
                key={item}
                type="button"
                variant={category === item ? 'default' : 'outline'}
                className={category === item
                  ? 'rounded-full bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong'
                  : 'rounded-full border-app-cabinet-border bg-white px-4 text-app-cabinet-text hover:bg-brand-secondary'}
                onClick={() => setCategory(item)}
              >
                {projectCategoryLabels[item]}
              </Button>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
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
          </div>
        </div>
      </AppSurface>

      {isPending ? <AppEmptyState title="Каталог обновляется" description="Подгружаем проекты и актуальные параметры по ним." /> : null}
      {isError ? <AppEmptyState title="Каталог временно недоступен" description="Не удалось получить список проектов. Попробуйте обновить страницу чуть позже." /> : null}

      {!isPending && !isError ? (
        visibleProjects.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {visibleProjects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-[2rem] border border-[#DCE6F5] bg-white shadow-[0_18px_40px_rgba(18,49,102,0.08)]"
              >
                <div className="grid h-full gap-0 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="relative min-h-[240px] border-b border-[#DCE6F5] lg:border-b-0 lg:border-r">
                    <Image
                      src={project.coverImageUrl ?? 'https://picsum.photos/seed/app-project-catalog/1200/800'}
                      alt={project.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07162f]/85 via-[#07162f]/35 to-transparent p-5 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{getProjectCategoryLabel(project.assetType)}</p>
                      <p className="mt-2 text-2xl font-semibold">{project.fundingProgress}% собрано</p>
                    </div>
                  </div>

                  <div className="flex h-full flex-col p-6">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-semibold tracking-tight text-brand-text">{project.title}</h3>
                      <p className="text-sm leading-6 text-brand-text-muted">{project.excerpt}</p>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <ProjectMeta label="Доходность" value={formatProjectYield(project.targetYield)} icon={<TrendingUp className="h-4 w-4" />} />
                      <ProjectMeta label="Срок" value={formatProjectTerm(project.termMonths)} icon={<Clock3 className="h-4 w-4" />} />
                      <ProjectMeta label="Локация" value={project.location} icon={<MapPin className="h-4 w-4" />} />
                      <ProjectMeta label="Минимальный вход" value={formatProjectMoney(project.minInvestment)} />
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="h-2 overflow-hidden rounded-full bg-brand-secondary/60">
                        <div className="h-full rounded-full bg-app-cabinet-primary" style={{ width: `${Math.min(project.fundingProgress, 100)}%` }} />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-brand-text-muted">
                        <span>{formatProjectMoney(project.currentAmount)} собрано</span>
                        <span>Цель {formatProjectMoney(project.targetAmount)}</span>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <Button asChild className="h-11 flex-1 rounded-full bg-app-cabinet-primary text-white hover:bg-app-cabinet-primary-strong">
                          <Link href={`/projects/${project.slug}#invest`}>Инвестировать</Link>
                        </Button>
                        <Button asChild variant="outline" className="h-11 flex-1 rounded-full border-app-cabinet-border bg-white text-brand-text hover:bg-brand-secondary">
                          <Link href={`/projects/${project.slug}`}>
                            Открыть карточку
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <AppEmptyState title="Под эти параметры проектов пока нет" description="Сбросьте часть фильтров или расширьте поиск по каталогу." />
        )
      ) : null}
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/66">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-white/72">{note}</p>
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={value === option.value ? 'default' : 'outline'}
            className={value === option.value
              ? 'rounded-full bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong'
              : 'rounded-full border-app-cabinet-border bg-white px-4 text-app-cabinet-text hover:bg-brand-secondary'}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ProjectMeta({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[#E2E8F0] bg-[#F7FAFF] px-4 py-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-text-muted">
        {icon}
        <span>{label}</span>
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-text">{value}</p>
    </div>
  );
}
