'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useOwnerProjectsQuery } from '@/entities/owner-project/api/hooks';
import { useOwnerRoundsQuery } from '@/entities/owner-round/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { OwnerRoundForm } from '@/features/owner-round/ui/owner-round-form';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { OwnerRoundSummaryGrid } from './owner-round-summary-grid';
import { OwnerRoundsTable } from './owner-rounds-table';

export default function OwnerRoundsPage() {
  const router = useRouter();
  const session = useSession();
  const roundsQuery = useOwnerRoundsQuery();
  const projectsQuery = useOwnerProjectsQuery();

  if (!session.token || roundsQuery.isPending || projectsQuery.isPending) {
    return null;
  }

  if (roundsQuery.isError || projectsQuery.isError) {
    return (
      <CabinetEmptyState
        title="Раздел раундов недоступен"
        description="Не удалось загрузить раунды или проекты компании."
      />
    );
  }

  const rounds = roundsQuery.data?.data ?? [];
  const projects = projectsQuery.data?.data ?? [];

  if (projects.length === 0) {
    return (
      <CabinetEmptyState
        title="Сначала нужен объект"
        description="Раунд нельзя открыть в вакууме. Сначала создайте проект, затем задайте окно размещения и условия входа."
      />
    );
  }

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Раунды"
        title="Раунды привлечения"
        description="Здесь вы управляете сроками сбора, условиями участия и следующими шагами по выплатам."
        actions={(
          <Link href="/owner/payouts">
            <Button variant="outline">Очередь Выплат</Button>
          </Link>
        )}
      />

      <OwnerRoundSummaryGrid rounds={rounds} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CabinetSurface
          eyebrow="Список"
          title="Все раунды"
          description="Следите за статусом каждого раунда и переходите в карточку для работы с участниками и выплатами."
        >
          {rounds.length === 0 ? (
            <CabinetEmptyState
              title="Раундов пока нет"
              description="Создайте первый раунд, чтобы открыть сбор инвестиций по выбранному объекту."
            />
          ) : (
            <OwnerRoundsTable rounds={rounds} />
          )}
        </CabinetSurface>

        <CabinetSurface
          eyebrow="Создание"
          title="Новый раунд"
          description="Задайте сроки сбора, условия участия и параметры выплат для нового раунда."
          variant="hero"
        >
          <OwnerRoundForm
            mode="create"
            round={null}
            projects={projects}
            onCreated={(slug) => router.push(`/owner/rounds/${slug}`)}
          />
        </CabinetSurface>
      </div>
    </div>
  );
}
