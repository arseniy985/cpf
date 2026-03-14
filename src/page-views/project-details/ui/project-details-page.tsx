'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Download, MapPin, ShieldAlert, TrendingUp } from 'lucide-react';
import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import {
  formatProjectMoney,
  formatProjectTerm,
  formatProjectYield,
  getProjectCategoryLabel,
} from '@/entities/project';
import { useProjectFaqQuery, useProjectForecastQuery, useProjectQuery } from '@/entities/project/api/hooks';
import { formatMoney } from '@/shared/lib/format';
import { useSession } from '@/features/session/model/use-session';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InvestmentApplicationForm } from '@/features/investment-application/ui/investment-application-form';

export default function ProjectDetailsPage({ projectSlug }: { projectSlug: string }) {
  const router = useRouter();
  const session = useSession();
  const { data: project, isPending, isError } = useProjectQuery(projectSlug);
  const faqQuery = useProjectFaqQuery(projectSlug);
  const [previewAmount, setPreviewAmount] = useState<number | null>(null);
  const forecastQuery = useProjectForecastQuery(
    projectSlug,
    previewAmount ?? project?.minInvestment ?? 10000,
    project?.termMonths,
  );

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-10 pb-20">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/projects" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
            ← Назад к проектам
          </Link>

          {isPending ? (
            <Card className="mt-6"><CardContent className="p-10 text-slate-500">Загружаем карточку проекта...</CardContent></Card>
          ) : !project ? (
            <Card className="mt-6"><CardContent className="p-10 text-slate-600">Проект не найден.</CardContent></Card>
          ) : (
            <>
              {isError ? (
                <Card className="mt-6 border-amber-200 bg-amber-50"><CardContent className="p-4 text-sm text-amber-900">Сейчас данные проекта могут обновляться с задержкой. Проверьте информацию чуть позже.</CardContent></Card>
              ) : null}

              <h1 className="mt-6 text-4xl font-display font-black text-indigo-950 md:text-6xl">{project.title}</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-600">{project.excerpt}</p>

              <div className="mt-10 grid gap-8 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-8">
                  <div className="relative h-[420px] overflow-hidden rounded-[32px] border border-slate-200">
                    <Image
                      src={project.coverImageUrl ?? 'https://picsum.photos/seed/project/1200/800'}
                      alt={project.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <Card className="rounded-[32px]">
                    <CardContent className="space-y-5 p-8">
                      <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
                        {getProjectCategoryLabel(project.assetType)}
                      </span>
                      <h2 className="text-2xl font-display font-black text-indigo-950">Инвестиционный тезис</h2>
                      <p className="text-base leading-relaxed text-slate-700">{project.description}</p>
                      {project.thesis ? <InfoBlock title="Почему этот актив">{project.thesis}</InfoBlock> : null}
                      {project.riskSummary ? <InfoBlock title="Риски">{project.riskSummary}</InfoBlock> : null}
                    </CardContent>
                  </Card>

                  <Card className="rounded-[32px]">
                    <CardContent className="space-y-4 p-8">
                      <h2 className="text-2xl font-display font-black text-indigo-950">Документы проекта</h2>
                      {project.documents.length === 0 ? (
                        <p className="text-sm text-slate-500">Документы пока не опубликованы.</p>
                      ) : (
                        project.documents.map((document) => (
                          <div key={document.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div>
                              <p className="font-bold text-indigo-950">{document.title}</p>
                              <p className="text-sm text-slate-500">{document.label ?? document.kind}</p>
                            </div>
                            {document.fileUrl ? (
                              <a href={document.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600">
                                <Download className="h-4 w-4" /> Открыть
                              </a>
                            ) : null}
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card className="rounded-[32px]">
                    <CardContent className="space-y-4 p-8">
                      <h2 className="text-2xl font-display font-black text-indigo-950">FAQ проекта</h2>
                      {(faqQuery.data ?? []).length === 0 ? (
                        <p className="text-sm text-slate-500">FAQ пока не опубликован.</p>
                      ) : (
                        faqQuery.data?.map((item) => (
                          <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="font-bold text-indigo-950">{item.question}</p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>

                <aside className="space-y-6 lg:col-span-4">
                  <Card className="sticky top-24 rounded-[32px]">
                    <CardContent className="space-y-5 p-8">
                      <h2 className="text-2xl font-display font-black text-indigo-950">Параметры сделки</h2>
                      <Metric label="Доходность" value={formatProjectYield(project.targetYield)} icon={<TrendingUp className="h-4 w-4" />} />
                      <Metric label="Срок" value={formatProjectTerm(project.termMonths)} icon={<Clock className="h-4 w-4" />} />
                      <Metric label="Локация" value={project.location} icon={<MapPin className="h-4 w-4" />} />
                      <Metric label="Мин. сумма" value={formatProjectMoney(project.minInvestment)} />
                      <Metric label="Риск" value={project.riskLevel} icon={<ShieldAlert className="h-4 w-4" />} />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-bold">
                          <span className="text-slate-500">Собрано</span>
                          <span className="text-indigo-950">{project.fundingProgress}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-teal-400" style={{ width: `${project.fundingProgress}%` }} />
                        </div>
                      </div>

                      <InvestmentApplicationForm
                        projectId={project.id}
                        minInvestment={project.minInvestment}
                        onRequireAuth={() => router.push('/login')}
                        onAmountPreviewChange={setPreviewAmount}
                      />
                    </CardContent>
                  </Card>

                  <Card className="rounded-[32px]">
                    <CardContent className="space-y-4 p-6">
                      <h3 className="text-xl font-display font-black text-indigo-950">Прогноз выплат</h3>
                      {forecastQuery.data ? (
                        <>
                          <Metric label="Ежемесячный доход" value={formatMoney(forecastQuery.data.monthlyIncome)} />
                          <Metric label="Общая сумма выплат" value={formatMoney(forecastQuery.data.totalPayout)} />
                          <div className="space-y-2">
                            {forecastQuery.data.schedule.slice(0, 4).map((item) => (
                              <div key={item.month} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                                <span className="text-slate-500">Месяц {item.month}</span>
                                <span className="font-bold text-indigo-950">{formatMoney(item.payout)}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-slate-500">Рассчитываем прогноз выплат...</p>
                      )}
                    </CardContent>
                  </Card>
                </aside>
              </div>
            </>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="inline-flex items-center gap-1 text-sm font-bold text-indigo-950">{icon}{value}</span>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{children}</p>
    </div>
  );
}
