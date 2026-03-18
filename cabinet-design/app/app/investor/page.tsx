import { WhatToDoNow } from "@/components/widgets/what-to-do-now";
import { KpiCard } from "@/components/widgets/kpi-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InvestorOverview() {
  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Обзор инвестора</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-brand-text-muted">Статус профиля:</span>
            <Badge variant="warning">KYC не завершен</Badge>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Пополнить кошелек</Button>
          <Button>Выбрать проект</Button>
        </div>
      </div>

      {/* Priority Action */}
      <WhatToDoNow 
        title="Завершите проверку профиля (KYC)"
        description="Для инвестирования в проекты платформы необходимо заполнить анкету и загрузить скан паспорта. Это требование законодательства."
        primaryActionLabel="Пройти проверку"
        secondaryActionLabel="Подробнее"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Доступный баланс" 
          value="0 ₽" 
          subtitle="В кошельке платформы"
        />
        <KpiCard 
          title="Активные заявки" 
          value="1" 
          subtitle="На сумму 500 000 ₽"
        />
        <KpiCard 
          title="В инвестициях" 
          value="1 250 000 ₽" 
          subtitle="В 3 активных проектах"
        />
        <KpiCard 
          title="Ожидаемые выплаты" 
          value="45 000 ₽" 
          subtitle="Ближайшая: 25 марта"
          trend={{ value: "12%", isPositive: true }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Operations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#E2E8F0] pb-4">
              <CardTitle>Последние операции</CardTitle>
              <Button variant="ghost" size="sm" className="text-brand-primary">Все операции</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#E2E8F0]">
                {[
                  { title: 'Заявка на инвестицию', project: 'ЖК "Северный"', amount: '- 500 000 ₽', status: 'pending', date: 'Сегодня, 14:30' },
                  { title: 'Пополнение кошелька', project: 'Банковский перевод', amount: '+ 500 000 ₽', status: 'completed', date: 'Вчера, 10:15' },
                  { title: 'Выплата дохода', project: 'БЦ "Авангард"', amount: '+ 15 000 ₽', status: 'completed', date: '12 марта, 09:00' },
                ].map((op, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {op.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-brand-success" />
                        ) : (
                          <Clock className="h-5 w-5 text-brand-warning" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-text">{op.title}</p>
                        <p className="text-xs text-brand-text-muted">{op.project}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-sm font-medium",
                        op.amount.startsWith('+') ? "text-brand-success" : "text-brand-text"
                      )}>{op.amount}</p>
                      <p className="text-xs text-brand-text-muted">{op.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mini Portfolio */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#E2E8F0] pb-4">
              <CardTitle>Активные инвестиции</CardTitle>
              <Button variant="ghost" size="sm" className="text-brand-primary">Весь портфель</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#E2E8F0]">
                {[
                  { name: 'БЦ "Авангард"', amount: '750 000 ₽', yield: '18% годовых', term: 'до дек 2026', status: 'Активен' },
                  { name: 'Складской комплекс "Юг"', amount: '500 000 ₽', yield: '20% годовых', term: 'до мар 2027', status: 'Активен' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-brand-text">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-brand-text-muted">{item.yield}</span>
                        <span className="text-xs text-brand-text-muted">•</span>
                        <span className="text-xs text-brand-text-muted">{item.term}</span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <p className="text-sm font-medium text-brand-text">{item.amount}</p>
                      <ArrowRight className="h-4 w-4 text-brand-text-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-8">
          
          {/* Notifications */}
          <Card className="bg-brand-secondary/30 border-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Уведомления</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-brand-text">Опубликован новый проект</p>
                <p className="text-xs text-brand-text-muted">ЖК &quot;Северный&quot; открыт для сбора. Целевая доходность 22%.</p>
                <p className="text-[10px] text-brand-text-muted mt-1">2 часа назад</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-brand-text">Отчет за Q4 доступен</p>
                <p className="text-xs text-brand-text-muted">Загружен финансовый отчет по проекту БЦ &quot;Авангард&quot;.</p>
                <p className="text-[10px] text-brand-text-muted mt-1">Вчера</p>
              </div>
              <Button variant="link" className="px-0 h-auto text-xs">Все уведомления</Button>
            </CardContent>
          </Card>

          {/* Quick Documents */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Новые документы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-brand-text-muted mt-0.5" />
                <div>
                  <p className="text-sm text-brand-text hover:text-brand-primary cursor-pointer transition-colors">Договор займа №45-2</p>
                  <p className="text-xs text-brand-text-muted">Требует подписания</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-brand-text-muted mt-0.5" />
                <div>
                  <p className="text-sm text-brand-text hover:text-brand-primary cursor-pointer transition-colors">Отчет БЦ Авангард Q4</p>
                  <p className="text-xs text-brand-text-muted">Информационно</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
