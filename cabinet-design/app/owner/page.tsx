import { WhatToDoNow } from "@/components/widgets/what-to-do-now";
import { KpiCard } from "@/components/widgets/kpi-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export default function OwnerOverview() {
  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Обзор владельца объектов</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-brand-text-muted">Организация:</span>
            <span className="text-sm font-medium text-brand-text">ООО &quot;Девелопмент Групп&quot;</span>
            <Badge variant="success" className="ml-2">Активен</Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Новый проект</Button>
          <Button>Создать раунд</Button>
        </div>
      </div>

      {/* Priority Action */}
      <WhatToDoNow 
        title="Требуется загрузить отчетность"
        description="По проекту БЦ &laquo;Авангард&raquo; подошел срок публикации ежеквартального отчета за Q1 2026. Крайний срок: 20 марта."
        primaryActionLabel="Загрузить отчет"
        secondaryActionLabel="Перейти к проекту"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Активные проекты" 
          value="2" 
          subtitle="В управлении"
        />
        <KpiCard 
          title="Открытые раунды" 
          value="1" 
          subtitle="Сбор средств: 45%"
        />
        <KpiCard 
          title="Привлечено средств" 
          value="125 млн ₽" 
          subtitle="За все время"
        />
        <KpiCard 
          title="Ближайшая выплата" 
          value="2.5 млн ₽" 
          subtitle="Срок: 25 марта"
          trend={{ value: "Требует согласования", isPositive: false }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Rounds */}
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#E2E8F0] pb-4">
              <CardTitle>Текущие раунды привлечения</CardTitle>
              <Button variant="ghost" size="sm" className="text-brand-primary">Все раунды</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-base font-semibold text-brand-text">ЖК &quot;Северный&quot; — Раунд 1</h4>
                    <p className="text-sm text-brand-text-muted mt-1">Цель: 50 000 000 ₽ • Осталось 14 дней</p>
                  </div>
                  <Badge variant="success">Идет сбор</Badge>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-brand-text">22 500 000 ₽ собрано</span>
                    <span className="text-brand-text-muted">45%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full" style={{ width: '45%' }} />
                  </div>
                  <div className="flex justify-between text-xs text-brand-text-muted mt-2">
                    <span>12 инвесторов</span>
                    <span>Мин. вход: 500 000 ₽</span>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Button variant="secondary" size="sm" className="w-full">Управление аллокациями</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Platform Notes / Blockers */}
          <Card className="shadow-none border-brand-error/20">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-brand-error" />
                <CardTitle>Замечания платформы</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#E2E8F0]">
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-brand-text">Обновить фин. модель</p>
                      <p className="text-xs text-brand-text-muted mt-1">Проект: Складской комплекс &quot;Юг&quot;</p>
                      <p className="text-sm text-brand-text mt-2">Аналитик запросил детализацию операционных расходов за 2025 год.</p>
                    </div>
                    <Button variant="link" size="sm">Исправить</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-8">
          
          {/* Upcoming Actions */}
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Календарь событий</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-sm p-2 min-w-[48px]">
                  <span className="text-xs text-brand-text-muted">Мар</span>
                  <span className="text-sm font-bold text-brand-text">20</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-medium text-brand-text">Отчет за Q1</p>
                  <p className="text-xs text-brand-text-muted">БЦ &quot;Авангард&quot;</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center justify-center bg-brand-warning/10 rounded-sm p-2 min-w-[48px]">
                  <span className="text-xs text-brand-warning">Мар</span>
                  <span className="text-sm font-bold text-brand-warning">25</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-medium text-brand-text">Выплата инвесторам</p>
                  <p className="text-xs text-brand-text-muted">2.5 млн ₽ • Требует апрува</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="shadow-none bg-brand-secondary/30 border-transparent">
            <CardContent className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start text-brand-text hover:text-brand-primary">
                <FileText className="mr-2 h-4 w-4" />
                Реестр инвесторов
              </Button>
              <Button variant="ghost" className="w-full justify-start text-brand-text hover:text-brand-primary">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Документы организации
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
