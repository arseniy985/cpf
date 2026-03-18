import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";

export default function InvestorVerification() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-text">Проверка профиля (KYC)</h1>
        <p className="text-sm text-brand-text-muted mt-1">Заполните данные для получения статуса квалифицированного инвестора</p>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[#E2E8F0]">
            <div className="p-6 flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-brand-success shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-brand-text">1. Контактные данные</h3>
                <p className="text-sm text-brand-text-muted mt-1">Email и телефон подтверждены.</p>
              </div>
            </div>
            <div className="p-6 flex gap-4 bg-brand-secondary/20">
              <Circle className="h-6 w-6 text-brand-primary shrink-0" />
              <div className="w-full">
                <h3 className="text-base font-semibold text-brand-text">2. Паспортные данные</h3>
                <p className="text-sm text-brand-text-muted mt-1 mb-4">Заполните анкету и загрузите скан-копии паспорта.</p>
                <Button>Заполнить анкету</Button>
              </div>
            </div>
            <div className="p-6 flex gap-4 opacity-50">
              <Circle className="h-6 w-6 text-brand-text-muted shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-brand-text">3. Проверка менеджером</h3>
                <p className="text-sm text-brand-text-muted mt-1">Ожидайте проверки данных службой безопасности.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
