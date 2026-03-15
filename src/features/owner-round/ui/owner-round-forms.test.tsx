import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { OwnerDistributionForm } from '@/features/owner-round/ui/owner-distribution-form';
import { OwnerRoundForm } from '@/features/owner-round/ui/owner-round-form';

const mocks = vi.hoisted(() => ({
  createRoundMutation: {
    mutateAsync: vi.fn(async () => ({ data: { slug: 'galleria-main-bridge' } })),
    isPending: false,
  },
  updateRoundMutation: {
    mutateAsync: vi.fn(async () => ({ data: { slug: 'galleria-main-bridge' } })),
    isPending: false,
  },
  createDistributionMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'distribution-1' } })),
    isPending: false,
  },
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

vi.mock('@/entities/owner-round/api/hooks', () => ({
  useCreateOwnerRoundMutation: () => mocks.createRoundMutation,
  useUpdateOwnerRoundMutation: () => mocks.updateRoundMutation,
  useCreateOwnerDistributionMutation: () => mocks.createDistributionMutation,
}));

describe('owner round forms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates owner round with numeric conversion and redirects callback', async () => {
    const user = userEvent.setup();
    const onCreated = vi.fn();

    render(
      <OwnerRoundForm
        mode="create"
        round={null}
        projects={[
          {
            id: 'project-1',
            slug: 'galleria-moscow',
            title: 'Галерея Москва',
            excerpt: 'excerpt',
            description: 'description',
            thesis: null,
            riskSummary: null,
            location: 'Москва',
            assetType: 'commercial_real_estate',
            status: 'published',
            fundingStatus: 'collecting',
            riskLevel: 'moderate',
            payoutFrequency: 'monthly',
            minInvestment: 10000,
            targetAmount: 30000000,
            currentAmount: 16000000,
            targetYield: 18.5,
            termMonths: 24,
            coverImageUrl: null,
            heroMetric: null,
            isFeatured: true,
            publishedAt: '2026-03-01T00:00:00Z',
            fundingProgress: 50,
            documents: [],
          },
        ]}
        defaultProjectId="project-1"
        onCreated={onCreated}
      />,
    );

    await user.type(screen.getByLabelText('Название раунда'), 'Bridge Round');
    await user.type(screen.getByLabelText('Адрес раунда'), 'galleria-main-bridge');
    await user.clear(screen.getByLabelText('Целевой объем'));
    await user.type(screen.getByLabelText('Целевой объем'), '9000000');
    await user.clear(screen.getByLabelText('Мин. чек'));
    await user.type(screen.getByLabelText('Мин. чек'), '25000');
    await user.clear(screen.getByLabelText('Доходность, %'));
    await user.type(screen.getByLabelText('Доходность, %'), '16.8');
    await user.clear(screen.getByLabelText('Срок, мес'));
    await user.type(screen.getByLabelText('Срок, мес'), '12');
    await user.type(screen.getByLabelText('Открытие окна'), '2026-03-20');
    await user.type(screen.getByLabelText('Закрытие окна'), '2026-04-20');
    await user.type(screen.getByLabelText('Операционные заметки'), 'Bridge window for fast allocation.');
    await user.click(screen.getByRole('button', { name: 'Создать Раунд' }));

    expect(mocks.createRoundMutation.mutateAsync).toHaveBeenCalledWith({
      project_id: 'project-1',
      slug: 'galleria-main-bridge',
      title: 'Bridge Round',
      target_amount: 9000000,
      min_investment: 25000,
      target_yield: 16.8,
      payout_frequency: 'monthly',
      term_months: 12,
      oversubscription_allowed: false,
      opens_at: '2026-03-20',
      closes_at: '2026-04-20',
      notes: 'Bridge window for fast allocation.',
    });
    expect(onCreated).toHaveBeenCalledWith('galleria-main-bridge');
  });

  it('creates distribution with numeric amount', async () => {
    const user = userEvent.setup();

    render(<OwnerDistributionForm roundSlug="galleria-moscow-main-round" />);

    await user.type(screen.getByLabelText('Название выплаты'), 'Мартовская выплата');
    await user.type(screen.getByLabelText('Период'), 'Март 2026');
    await user.type(screen.getByLabelText('Начало периода'), '2026-03-01');
    await user.type(screen.getByLabelText('Конец периода'), '2026-03-31');
    await user.type(screen.getByLabelText('Сумма к распределению'), '24000');
    await user.type(screen.getByLabelText('Комментарий к выплате'), 'First distribution for investors.');
    await user.click(screen.getByRole('button', { name: 'Сформировать реестр выплат' }));

    expect(mocks.createDistributionMutation.mutateAsync).toHaveBeenCalledWith({
      roundSlug: 'galleria-moscow-main-round',
      payload: {
        title: 'Мартовская выплата',
        period_label: 'Март 2026',
        period_start: '2026-03-01',
        period_end: '2026-03-31',
        total_amount: 24000,
        payout_mode: 'manual',
        notes: 'First distribution for investors.',
      },
    });
  });
});
