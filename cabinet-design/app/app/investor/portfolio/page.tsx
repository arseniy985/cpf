import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, Download, FileText, History } from "lucide-react";

export default function InvestorPortfolio() {
  const portfolioItems = [
    {
      id: 'INV-001',
      project: 'БЦ "Авангард"',
      amount: '750 000 ₽',
      date: '15.01.2026',
      yield: '18%',
      term: '24 мес.',
      status: 'approved',
      statusText: 'Активна',
    },
    {
      id: 'INV-002',
      project: 'Складской комплекс "Юг"',
      amount: '500 000 ₽',
      date: '10.02.2026',
      yield: '20%',
      term: '12 мес.',
      status: 'approved',
      statusText: 'Активна',
    },
    {
      id: 'REQ-003',
      project: 'ЖК "Северный"',
      amount: '500 000 ₽',
      date: '17.03.2026',
      yield: '22%',
      term: '36 мес.',
      status: 'pending',
      statusText: 'Заявка на рассмотрении',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Портфель</h1>
          <p className="text-sm text-brand-text-muted mt-1">Управление инвестициями и заявками</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Badge variant="default" className="cursor-pointer whitespace-nowrap">Все (3)</Badge>
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">Активные (2)</Badge>
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">Заявки (1)</Badge>
          <Badge variant="outline" className="cursor-pointer whitespace-nowrap">Завершенные (0)</Badge>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-brand-text-muted w-full sm:w-auto justify-start sm:justify-center">
          <Filter className="h-4 w-4" />
          Фильтры
        </Button>
      </div>

      {/* Desktop Table (Hidden on mobile) */}
      <div className="hidden md:block bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-brand-text-muted uppercase bg-gray-50 border-b border-[#E2E8F0]">
            <tr>
              <th className="px-6 py-4 font-medium">Проект</th>
              <th className="px-6 py-4 font-medium">Сумма</th>
              <th className="px-6 py-4 font-medium">Дата</th>
              <th className="px-6 py-4 font-medium">Доходность</th>
              <th className="px-6 py-4 font-medium">Срок</th>
              <th className="px-6 py-4 font-medium">Статус</th>
              <th className="px-6 py-4 font-medium text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {portfolioItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-brand-text">{item.project}</td>
                <td className="px-6 py-4">{item.amount}</td>
                <td className="px-6 py-4 text-brand-text-muted">{item.date}</td>
                <td className="px-6 py-4">{item.yield}</td>
                <td className="px-6 py-4 text-brand-text-muted">{item.term}</td>
                <td className="px-6 py-4">
                  <Badge variant={item.status === 'approved' ? 'success' : 'warning'}>
                    {item.statusText}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Документы">
                      <FileText className="h-4 w-4 text-brand-text-muted" />
                    </Button>
                    <Button variant="ghost" size="icon" title="История">
                      <History className="h-4 w-4 text-brand-text-muted" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4 text-brand-text" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (Hidden on desktop) */}
      <div className="md:hidden space-y-4">
        {portfolioItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-brand-text">{item.project}</h3>
                  <p className="text-xs text-brand-text-muted mt-1">{item.date}</p>
                </div>
                <Badge variant={item.status === 'approved' ? 'success' : 'warning'}>
                  {item.statusText}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-3 border-y border-[#E2E8F0]">
                <div>
                  <p className="text-xs text-brand-text-muted">Сумма</p>
                  <p className="text-sm font-medium text-brand-text mt-0.5">{item.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-text-muted">Доходность / Срок</p>
                  <p className="text-sm font-medium text-brand-text mt-0.5">{item.yield} • {item.term}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" className="w-full text-xs h-9">Документы</Button>
                <Button className="w-full text-xs h-9">Подробнее</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
