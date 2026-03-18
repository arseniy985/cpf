import { EmptyState } from "@/components/widgets/empty-state";
import { Wallet } from "lucide-react";

export default function InvestorWallet() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Кошелек</h1>
          <p className="text-sm text-brand-text-muted mt-1">Управление средствами и история операций</p>
        </div>
      </div>
      <EmptyState 
        icon={Wallet}
        title="Кошелек пуст"
        description="Пополните кошелек, чтобы начать инвестировать в проекты платформы."
        actionLabel="Пополнить кошелек"
      />
    </div>
  );
}
