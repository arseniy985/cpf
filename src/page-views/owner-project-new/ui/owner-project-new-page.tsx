'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/features/session/model/use-session';
import { Button } from '@/components/ui/button';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { OwnerProjectForm } from '@/features/owner-project/ui/owner-project-form';

export default function OwnerProjectNewPage() {
  const router = useRouter();
  const session = useSession();

  if (!session.token) {
    return null;
  }

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Проекты"
        title="Новый проект"
        description="Создайте проект, заполните основную информацию и подготовьте его к проверке."
        actions={(
          <Link href="/owner/projects">
            <Button variant="outline" className="rounded-lg border-slate-200 bg-white">
              Назад к списку
            </Button>
          </Link>
        )}
      />

      <CabinetSurface title="Карточка проекта" description="После сохранения вы сможете добавить документы, отчетность и отправить проект на проверку.">
        <OwnerProjectForm
          project={null}
          onCreated={(slug) => router.push(`/owner/projects/${slug}`)}
        />
      </CabinetSurface>
    </div>
  );
}
