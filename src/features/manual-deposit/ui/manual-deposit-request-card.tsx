'use client';

import { Copy, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ManualDepositReceiptForm } from '@/features/manual-deposit/ui/manual-deposit-receipt-form';
import type { ManualDepositRequest } from '@/entities/cabinet/api/types';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { StatusBadge } from '@/shared/ui/status-badge';

type ManualDepositRequestCardProps = {
  request: ManualDepositRequest;
  isCancelling: boolean;
  onCancel: (id: string) => Promise<void>;
};

function formatAccount(value: string) {
  return value.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function ManualDepositRequestCard({
  request,
  isCancelling,
  onCancel,
}: ManualDepositRequestCardProps) {
  const canUploadReceipt = ['awaiting_transfer', 'awaiting_user_clarification'].includes(request.status);
  const canCancel = ['awaiting_transfer', 'awaiting_user_clarification'].includes(request.status);

  return (
    <article className="rounded-[28px] border border-cabinet-border bg-cabinet-panel-strong p-5 shadow-[0_22px_60px_rgba(26,38,51,0.08)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">
              Заявка {request.referenceCode}
            </p>
            <StatusBadge status={request.status} />
          </div>
          <h3 className="font-mono text-[30px] font-semibold tracking-[-0.05em] text-cabinet-ink">
            {formatMoney(request.amount, request.currency)}
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-cabinet-muted-ink">
            Переведите сумму по реквизитам ниже. После отправки платежа загрузите чек, чтобы менеджер быстрее сопоставил перевод.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {request.receiptDownloadUrl ? (
            <Button asChild variant="outline">
              <a href={request.receiptDownloadUrl} target="_blank" rel="noreferrer">
                <Download className="size-4" />
                Чек
              </a>
            </Button>
          ) : null}
          {canCancel ? (
            <Button variant="ghost" disabled={isCancelling} onClick={() => void onCancel(request.id)}>
              <RotateCcw className="size-4" />
              {isCancelling ? 'Отменяем…' : 'Отменить'}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[22px] bg-white/88 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">
            Инструкция на оплату
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MetaLine label="Получатель" value={request.recipientName} />
            <MetaLine label="Банк" value={request.bankName} />
            <MetaLine label="Счёт" value={formatAccount(request.bankAccount)} />
            <MetaLine label="БИК" value={request.bankBik ?? 'Не указано'} />
            <MetaLine label="Корр. счёт" value={request.correspondentAccount ? formatAccount(request.correspondentAccount) : 'Не указано'} />
            <MetaLine label="Назначение" value={request.paymentPurpose} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(request.paymentPurpose);
                  toast.success('Назначение платежа скопировано');
                } catch {
                  toast.error('Не удалось скопировать назначение платежа.');
                }
              }}
            >
              <Copy className="size-4" />
              Скопировать назначение
            </Button>
          </div>
        </section>

        <section className="rounded-[22px] border border-cabinet-border bg-cabinet-panel p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">
            Сопровождение
          </p>
          <div className="mt-4 space-y-2 text-sm text-cabinet-muted-ink">
            <p>
              <span className="font-medium text-cabinet-ink">Менеджер:</span> {request.managerName ?? 'Команда CPF'}
            </p>
            {request.managerPhone ? (
              <p>
                <span className="font-medium text-cabinet-ink">Телефон:</span> {request.managerPhone}
              </p>
            ) : null}
            {request.managerEmail ? (
              <p>
                <span className="font-medium text-cabinet-ink">Email:</span> {request.managerEmail}
              </p>
            ) : null}
            {request.managerTelegram ? (
              <p>
                <span className="font-medium text-cabinet-ink">Telegram:</span> {request.managerTelegram}
              </p>
            ) : null}
            <p>
              <span className="font-medium text-cabinet-ink">Дедлайн:</span> {formatDateTime(request.expiresAt)}
            </p>
          </div>

          {request.reviewNote ? (
            <div className="mt-4 rounded-[18px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
              {request.reviewNote}
            </div>
          ) : null}

          <div className="mt-4">
            {canUploadReceipt ? (
              <ManualDepositReceiptForm requestId={request.id} />
            ) : (
              <p className="text-sm leading-relaxed text-cabinet-muted-ink">
                {request.status === 'credited'
                  ? 'Перевод подтверждён и уже зачислен в кошелёк.'
                  : 'Чек уже отправлен, менеджер завершает проверку.'}
              </p>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[18px] border border-cabinet-border/70 bg-cabinet-panel px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cabinet-muted-ink">{label}</p>
      <p className="mt-2 break-words text-sm font-medium leading-relaxed text-cabinet-ink">{value}</p>
    </div>
  );
}
