'use client';

import { useCabinetDocumentsQuery } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatDate } from '@/shared/lib/format';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';

export default function DashboardDocumentsPage() {
  const session = useSession();
  const documentsQuery = useCabinetDocumentsQuery();

  if (!session.token || documentsQuery.isPending) {
    return null;
  }

  const documents = documentsQuery.data?.data ?? { projectDocuments: [], legalDocuments: [] };
  const total = documents.projectDocuments.length + documents.legalDocuments.length;

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Документы"
        title="Документы и материалы"
        description="Единый рабочий архив по вашим сделкам и юридическим документам платформы."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CabinetStatCard label="Всего документов" value={String(total)} />
        <CabinetStatCard label="Проектных" value={String(documents.projectDocuments.length)} />
        <CabinetStatCard label="Юридических" value={String(documents.legalDocuments.length)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CabinetSurface title="Документы проектов" description="Материалы по проектам, в которых вы участвуете.">
          {documents.projectDocuments.length === 0 ? (
            <CabinetEmptyState
              title="Проектных файлов пока нет"
              description="Документы появятся после подтверждения участия или перевода заявки в рабочий статус."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Документ</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead className="text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.projectDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-950">{document.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{document.label ?? document.kind}</p>
                      </div>
                    </TableCell>
                    <TableCell>{document.kind}</TableCell>
                    <TableCell className="text-right">
                      {document.fileUrl ? (
                        <a href={document.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline">
                          Открыть
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">Нет файла</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CabinetSurface>

        <CabinetSurface title="Юридические документы" description="Основные документы платформы, доступные в кабинете.">
          {documents.legalDocuments.length === 0 ? (
            <CabinetEmptyState
              title="Юридических файлов пока нет"
              description="Документы появятся здесь, как только они будут опубликованы."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Документ</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead className="text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.legalDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-950">{document.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{formatDate(document.publishedAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>{document.documentType}</TableCell>
                    <TableCell className="text-right">
                      {document.fileUrl ? (
                        <a href={document.fileUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline">
                          Открыть
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">Нет файла</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CabinetSurface>
      </div>
    </div>
  );
}
