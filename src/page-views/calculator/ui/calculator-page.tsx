'use client';

import { useMemo, useState } from 'react';
import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import Link from 'next/link';
import { ArrowRight, Download, Info, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProjectForecastQuery, useProjectsQuery } from '@/entities/project/api/hooks';
import { formatProjectMoney, formatProjectTerm, formatProjectYield } from '@/entities/project';

function formatCurrency(value: number) {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}

export default function CalculatorPage() {
  const projectsQuery = useProjectsQuery('', 'Все');
  const projects = useMemo(() => projectsQuery.data ?? [], [projectsQuery.data]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const activeSlug = selectedSlug || projects[0]?.slug || '';
  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === activeSlug) ?? null,
    [projects, activeSlug],
  );
  const [amount, setAmount] = useState(100000);
  const [months, setMonths] = useState(24);
  const effectiveAmount = selectedProject ? Math.max(amount, selectedProject.minInvestment) : amount;
  const effectiveMonths = selectedProject ? Math.max(months, 6) : months;

  const forecastQuery = useProjectForecastQuery(
    selectedProject?.slug ?? '',
    effectiveAmount,
    effectiveMonths,
  );

  function handleDownloadPdf() {
    if (typeof window === 'undefined' || !selectedProject || !forecastQuery.data) {
      return;
    }

    const reportWindow = window.open('', '_blank', 'noopener,noreferrer,width=980,height=720');

    if (!reportWindow) {
      return;
    }

    const rows = forecastQuery.data.schedule
      .slice(0, 12)
      .map(
        (item) => `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #d8dee8;">Месяц ${item.month}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #d8dee8;text-align:right;">${formatCurrency(item.payout)}</td>
          </tr>
        `,
      )
      .join('');

    reportWindow.document.write(`
      <html lang="ru">
        <head>
          <title>Расчет доходности - ${selectedProject.title}</title>
          <meta charset="utf-8" />
        </head>
        <body style="font-family: Arial, sans-serif; color:#1f3242; padding:32px;">
          <h1 style="margin:0 0 8px;">Расчет доходности по проекту</h1>
          <p style="margin:0 0 24px; color:#516174;">${selectedProject.title}</p>
          <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:16px; margin-bottom:24px;">
            <div style="padding:16px; border:1px solid #d8dee8; border-radius:16px;">
              <div style="font-size:12px; text-transform:uppercase; color:#667085;">Сумма участия</div>
              <div style="font-size:24px; font-weight:700; margin-top:8px;">${formatCurrency(effectiveAmount)}</div>
            </div>
            <div style="padding:16px; border:1px solid #d8dee8; border-radius:16px;">
              <div style="font-size:12px; text-transform:uppercase; color:#667085;">Срок</div>
              <div style="font-size:24px; font-weight:700; margin-top:8px;">${effectiveMonths} мес.</div>
            </div>
            <div style="padding:16px; border:1px solid #d8dee8; border-radius:16px;">
              <div style="font-size:12px; text-transform:uppercase; color:#667085;">Ежемесячный доход</div>
              <div style="font-size:24px; font-weight:700; margin-top:8px;">${formatCurrency(forecastQuery.data.monthlyIncome)}</div>
            </div>
            <div style="padding:16px; border:1px solid #d8dee8; border-radius:16px;">
              <div style="font-size:12px; text-transform:uppercase; color:#667085;">Сумма выплат</div>
              <div style="font-size:24px; font-weight:700; margin-top:8px;">${formatCurrency(forecastQuery.data.totalPayout)}</div>
            </div>
          </div>
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr>
                <th style="padding:10px 12px; text-align:left; border-bottom:2px solid #1f3242;">Период</th>
                <th style="padding:10px 12px; text-align:right; border-bottom:2px solid #1f3242;">Выплата</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="margin-top:24px; font-size:12px; color:#667085;">
            Расчет носит информационный характер. Финальные параметры фиксируются в документах проекта и подтверждаются в личном кабинете.
          </p>
        </body>
      </html>
    `);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 pt-12 pb-24">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-16 h-2 bg-teal-400 mb-6"></div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-indigo-950 tracking-tighter leading-[1]">
            КАЛЬКУЛЯТОР <span className="text-indigo-600">ДОХОДНОСТИ</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-3xl leading-relaxed">
            Выберите реальный проект из витрины, задайте сумму входа и сразу получите ориентир по выплатам на базе текущих параметров сделки.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[32px] p-8">
            <h2 className="text-2xl font-display font-bold text-indigo-950">Параметры расчета</h2>

            <div className="mt-8 space-y-7">
              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Проект</label>
                <div className="mt-3 grid gap-3">
                  {projects.slice(0, 3).map((project) => (
                    <Button
                      key={project.id}
                      type="button"
                      onClick={() => {
                        setSelectedSlug(project.slug);
                        setAmount(project.minInvestment);
                        setMonths(project.termMonths);
                      }}
                      variant={selectedProject?.slug === project.slug ? 'secondary' : 'outline'}
                      className={`h-auto w-full justify-start px-4 py-4 text-left ${
                        selectedProject?.slug === project.slug
                          ? 'text-white'
                          : 'bg-slate-50 text-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <div>
                        <p className="font-bold">{project.title}</p>
                        <p className={`mt-1 text-sm ${selectedProject?.slug === project.slug ? 'text-indigo-200' : 'text-slate-500'}`}>
                          {formatProjectYield(project.targetYield)} · {formatProjectTerm(project.termMonths)} · вход {formatProjectMoney(project.minInvestment)}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Сумма</label>
                <Slider
                  min={selectedProject?.minInvestment ?? 10000}
                  max={5000000}
                  step={10000}
                  value={[amount]}
                  onValueChange={([value]) => setAmount(value ?? amount)}
                  className="mt-4"
                />
                <p className="mt-2 text-2xl font-display font-bold text-indigo-950">{formatCurrency(effectiveAmount)}</p>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Срок участия</label>
                <Slider
                  min={6}
                  max={selectedProject ? Math.max(selectedProject.termMonths, 36) : 60}
                  step={6}
                  value={[months]}
                  onValueChange={([value]) => setMonths(value ?? months)}
                  className="mt-4"
                />
                <p className="mt-2 text-2xl font-display font-bold text-indigo-950">{effectiveMonths} мес.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <article className="bg-indigo-950 text-white rounded-[32px] p-8">
              <h2 className="text-2xl font-display font-bold">Результат расчета</h2>
              <p className="mt-2 text-sm text-indigo-200">
                {selectedProject ? selectedProject.title : 'Загружаем список проектов…'}
              </p>
              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <div className="bg-indigo-900/60 border border-indigo-800 rounded-2xl p-4">
                  <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Ежемесячно</p>
                  <p className="mt-2 text-2xl font-display font-bold text-teal-400">
                    {forecastQuery.data ? formatCurrency(forecastQuery.data.monthlyIncome) : '...'}
                  </p>
                </div>
                <div className="bg-indigo-900/60 border border-indigo-800 rounded-2xl p-4">
                  <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Доходность проекта</p>
                  <p className="mt-2 text-2xl font-display font-bold text-teal-400">
                    {selectedProject ? formatProjectYield(selectedProject.targetYield) : '...'}
                  </p>
                </div>
                <div className="bg-indigo-900/60 border border-indigo-800 rounded-2xl p-4">
                  <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Сумма выплат</p>
                  <p className="mt-2 text-2xl font-display font-bold">
                    {forecastQuery.data ? formatCurrency(forecastQuery.data.totalPayout) : '...'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <Link href={selectedProject ? `/projects/${selectedProject.slug}#invest` : '/projects'}>
                    Перейти к инвестированию <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" onClick={handleDownloadPdf} disabled={!selectedProject || !forecastQuery.data}>
                  <Download className="w-4 h-4" /> Сформировать PDF
                </Button>
              </div>
            </article>

            <article className="bg-white border border-slate-200 rounded-[32px] p-8">
              <h3 className="text-2xl font-display font-bold text-indigo-950">Прогноз по месяцам</h3>
              <div className="mt-5 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Месяц</TableHead>
                      <TableHead>Выплата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(forecastQuery.data?.schedule ?? []).slice(0, 12).map((item) => (
                      <TableRow key={item.month}>
                        <TableCell className="font-medium text-slate-700">{item.month}</TableCell>
                        <TableCell className="font-bold text-indigo-700">{formatCurrency(item.payout)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </article>

            <article className="bg-slate-100 border border-slate-200 rounded-[28px] p-6 flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
              <p className="text-sm text-slate-600 leading-relaxed">
                Расчет носит информационный характер и не является офертой или индивидуальной инвестиционной рекомендацией.
                Фактические условия фиксируются в документах конкретного проекта и подтверждаются в личном кабинете.
              </p>
            </article>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-3">
              <Wallet className="w-6 h-6 text-indigo-600 mt-1" />
              <div>
                <h4 className="text-xl font-display font-bold text-indigo-950">Нужен сценарий под ваш бюджет?</h4>
                <p className="mt-1 text-slate-600">Подберите проект в каталоге, а затем подтвердите участие в кабинете через существующий рабочий флоу.</p>
              </div>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link href="/projects">
                Открыть каталог <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
