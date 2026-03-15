import type { ReactNode } from 'react';
import { Layers3, Landmark, ListChecks, Radar } from 'lucide-react';
import type { OwnerRound } from '@/entities/owner-round/api/types';
import { formatCompactMoney } from '@/shared/lib/format';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';

export function OwnerRoundSummaryGrid({ rounds }: { rounds: OwnerRound[] }) {
  const liveRounds = rounds.filter((round) => round.status === 'live').length;
  const draftRounds = rounds.filter((round) => round.status === 'draft' || round.status === 'pending_review').length;
  const totalTarget = rounds.reduce((sum, round) => sum + round.targetAmount, 0);
  const totalAllocated = rounds.reduce((sum, round) => sum + round.currentAmount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <CabinetStatCard
        label="Раундов в работе"
        value={String(rounds.length)}
        hint="Все раунды по вашим объектам"
        accent={<SignalIcon icon={<Layers3 className="h-5 w-5" />} />}
      />
      <CabinetStatCard
        label="Открыто сейчас"
        value={String(liveRounds)}
        hint="Открыты для новых заявок инвесторов"
        accent={<SignalIcon icon={<Radar className="h-5 w-5" />} />}
      />
      <CabinetStatCard
        label="Требуют действий"
        value={String(draftRounds)}
        hint="Черновики и раунды перед запуском"
        accent={<SignalIcon icon={<ListChecks className="h-5 w-5" />} />}
      />
      <CabinetStatCard
        label="Объем раундов"
        value={formatCompactMoney(Math.max(totalTarget, totalAllocated))}
        hint={`Цель ${formatCompactMoney(totalTarget)} · собрано ${formatCompactMoney(totalAllocated)}`}
        accent={<SignalIcon icon={<Landmark className="h-5 w-5" />} />}
      />
    </div>
  );
}

function SignalIcon({ icon }: { icon: ReactNode }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cabinet-ink text-cabinet-panel-strong shadow-[0_16px_35px_rgba(31,50,66,0.22)]">
      {icon}
    </div>
  );
}
