import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { InvestmentApplicationForm } from '@/features/investment-application/ui/investment-application-form';
import { OwnerProjectDocumentForm } from '@/features/owner-project/ui/owner-project-document-form';
import { OwnerProjectForm } from '@/features/owner-project/ui/owner-project-form';
import { OwnerProjectReportForm } from '@/features/owner-project/ui/owner-project-report-form';

const mocks = vi.hoisted(() => ({
  createInvestmentMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'invest-1' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  createOwnerProjectMutation: {
    mutateAsync: vi.fn(async () => ({ data: { slug: 'bc-sever' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  updateOwnerProjectMutation: {
    mutateAsync: vi.fn(async () => ({ data: { slug: 'bc-sever' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  submitReviewMutation: {
    mutateAsync: vi.fn(async () => ({ data: { slug: 'bc-sever' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  createDocumentMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'doc-1' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  createReportMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'report-1' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
}));

vi.mock('@/features/session/model/use-session', () => ({
  useSession: () => ({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isError: false,
    error: null,
    setToken: vi.fn(),
    clearToken: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('@/entities/cabinet/api/hooks', () => ({
  useCreateInvestmentApplicationMutation: () => mocks.createInvestmentMutation,
}));

vi.mock('@/entities/owner-project/api/hooks', () => ({
  useCreateOwnerProjectMutation: () => mocks.createOwnerProjectMutation,
  useUpdateOwnerProjectMutation: () => mocks.updateOwnerProjectMutation,
  useSubmitOwnerProjectForReviewMutation: () => mocks.submitReviewMutation,
  useCreateOwnerProjectDocumentMutation: () => mocks.createDocumentMutation,
  useCreateOwnerProjectReportMutation: () => mocks.createReportMutation,
}));

describe('investment and owner forms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects unauthenticated user from investment application', async () => {
    const user = userEvent.setup();
    const onRequireAuth = vi.fn();

    render(
      <InvestmentApplicationForm
        projectId="project-1"
        minInvestment={10000}
        onRequireAuth={onRequireAuth}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Войти и инвестировать' }));

    expect(onRequireAuth).toHaveBeenCalled();
    expect(mocks.createInvestmentMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it('creates owner project and converts numeric fields', async () => {
    const user = userEvent.setup();
    const onCreated = vi.fn();

    render(<OwnerProjectForm project={null} onCreated={onCreated} />);

    await user.type(screen.getByLabelText('Адрес ссылки'), 'bc-sever');
    await user.type(screen.getByLabelText('Название'), 'БЦ Север');
    await user.type(screen.getByLabelText('Локация'), 'Москва');
    await user.type(screen.getByLabelText('Краткое описание'), 'Описание проекта для инвесторов');
    await user.type(screen.getByLabelText('Полное описание'), 'Подробное описание проекта для инвестиционной платформы.');
    await user.click(screen.getByRole('button', { name: 'Создать проект' }));

    expect(mocks.createOwnerProjectMutation.mutateAsync).toHaveBeenCalledWith({
      slug: 'bc-sever',
      title: 'БЦ Север',
      excerpt: 'Описание проекта для инвесторов',
      description: 'Подробное описание проекта для инвестиционной платформы.',
      thesis: undefined,
      risk_summary: undefined,
      location: 'Москва',
      asset_type: 'commercial_real_estate',
      risk_level: 'moderate',
      payout_frequency: 'monthly',
      min_investment: 10000,
      target_amount: 30000000,
      target_yield: 16,
      term_months: 24,
      cover_image_url: undefined,
      hero_metric: undefined,
    });
    expect(onCreated).toHaveBeenCalledWith('bc-sever');
  });

  it('submits owner project for review in edit mode', async () => {
    const user = userEvent.setup();

    render(
      <OwnerProjectForm
        onCreated={vi.fn()}
        project={{
          id: '1',
          slug: 'bc-sever',
          title: 'БЦ Север',
          excerpt: 'Кратко о проекте',
          description: 'Развернутое описание проекта для инвесторов',
          thesis: null,
          riskSummary: null,
          location: 'Москва',
          assetType: 'commercial_real_estate',
          status: 'draft',
          fundingStatus: 'draft',
          riskLevel: 'moderate',
          payoutFrequency: 'monthly',
          minInvestment: 10000,
          targetAmount: 30000000,
          currentAmount: 0,
          targetYield: 16,
          termMonths: 24,
          coverImageUrl: null,
          heroMetric: null,
          isFeatured: false,
          publishedAt: null,
          fundingProgress: 0,
          documents: [],
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Передать на модерацию' }));

    expect(mocks.submitReviewMutation.mutateAsync).toHaveBeenCalledWith({
      slug: 'bc-sever',
    });
  });

  it('creates owner document record', async () => {
    const user = userEvent.setup();

    render(<OwnerProjectDocumentForm slug="bc-sever" />);

    await user.type(screen.getByLabelText('Название документа'), 'Тизер');
    await user.type(screen.getByLabelText('Ссылка на файл'), 'https://example.com/teaser.pdf');
    await user.click(screen.getByRole('button', { name: 'Добавить документ' }));

    expect(mocks.createDocumentMutation.mutateAsync).toHaveBeenCalledWith({
      slug: 'bc-sever',
      title: 'Тизер',
      kind: 'teaser',
      file_url: 'https://example.com/teaser.pdf',
    });
  });

  it('creates owner report record', async () => {
    const user = userEvent.setup();

    render(<OwnerProjectReportForm slug="bc-sever" />);

    await user.type(screen.getByLabelText('Название отчета'), 'Отчет Q1');
    await user.type(screen.getByLabelText('Дата отчета'), '2026-03-01');
    await user.type(screen.getByLabelText('Ссылка на файл'), 'https://example.com/report.pdf');
    await user.type(screen.getByLabelText('Краткая сводка'), 'Все идет по плану');
    await user.click(screen.getByRole('button', { name: 'Добавить отчет' }));

    expect(mocks.createReportMutation.mutateAsync).toHaveBeenCalledWith({
      slug: 'bc-sever',
      title: 'Отчет Q1',
      report_date: '2026-03-01',
      file_url: 'https://example.com/report.pdf',
      summary: 'Все идет по плану',
    });
  });
});
