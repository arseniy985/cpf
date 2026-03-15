import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import DashboardPortfolioPage from '@/pages/dashboard-portfolio/ui/dashboard-portfolio-page';
import OwnerPayoutsPage from '@/pages/owner-payouts/ui/owner-payouts-page';
import OwnerRoundDetailsPage from '@/pages/owner-round-details/ui/owner-round-details-page';

const mocks = vi.hoisted(() => ({
  ownerRoundQuery: {
    isPending: false,
    isError: false,
    data: {
      data: {
        round: {
          id: 'round-1',
          projectId: 'project-1',
          projectTitle: 'Галерея Москва',
          projectSlug: 'galleria-moscow',
          slug: 'galleria-moscow-main-round',
          title: 'Основной Раунд',
          status: 'pending_review',
          targetAmount: 30000000,
          currentAmount: 16200000,
          minInvestment: 10000,
          targetYield: 18.5,
          payoutFrequency: 'monthly',
          termMonths: 24,
          oversubscriptionAllowed: false,
          opensAt: '2026-03-01T00:00:00Z',
          closesAt: '2026-04-01T00:00:00Z',
          reviewSubmittedAt: '2026-03-10T00:00:00Z',
          wentLiveAt: null,
          closedAt: null,
          notes: 'Main round',
          allocationCount: 1,
          distributionCount: 1,
        },
        project: {
          id: 'project-1',
          slug: 'galleria-moscow',
          title: 'Галерея Москва',
          excerpt: 'excerpt',
          description: 'description',
          thesis: 'thesis',
          riskSummary: 'risks',
          location: 'Москва',
          assetType: 'commercial_real_estate',
          status: 'published',
          fundingStatus: 'collecting',
          riskLevel: 'moderate',
          payoutFrequency: 'monthly',
          minInvestment: 10000,
          targetAmount: 30000000,
          currentAmount: 16200000,
          targetYield: 18.5,
          termMonths: 24,
          coverImageUrl: null,
          heroMetric: null,
          isFeatured: true,
          publishedAt: '2026-03-01T00:00:00Z',
          fundingProgress: 54,
          documents: [],
        },
        allocations: [
          {
            id: 'allocation-1',
            userId: 11,
            investorName: 'Investor Demo',
            investorEmail: 'investor@cpf.local',
            amount: 150000,
            status: 'confirmed',
            agreementUrl: 'https://example.com/agreement.pdf',
            allocatedAt: '2026-03-12T00:00:00Z',
            settledAt: null,
            project: {
              id: 'project-1',
              slug: 'galleria-moscow',
              title: 'Галерея Москва',
              excerpt: 'excerpt',
              description: 'description',
              thesis: 'thesis',
              riskSummary: 'risks',
              location: 'Москва',
              assetType: 'commercial_real_estate',
              status: 'published',
              fundingStatus: 'collecting',
              riskLevel: 'moderate',
              payoutFrequency: 'monthly',
              minInvestment: 10000,
              targetAmount: 30000000,
              currentAmount: 16200000,
              targetYield: 18.5,
              termMonths: 24,
              coverImageUrl: null,
              heroMetric: null,
              isFeatured: true,
              publishedAt: '2026-03-01T00:00:00Z',
              fundingProgress: 54,
              documents: [],
            },
            round: {
              id: 'round-1',
              projectId: 'project-1',
              projectTitle: 'Галерея Москва',
              projectSlug: 'galleria-moscow',
              slug: 'galleria-moscow-main-round',
              title: 'Основной Раунд',
              status: 'pending_review',
              targetAmount: 30000000,
              currentAmount: 16200000,
              minInvestment: 10000,
              targetYield: 18.5,
              payoutFrequency: 'monthly',
              termMonths: 24,
              oversubscriptionAllowed: false,
              opensAt: '2026-03-01T00:00:00Z',
              closesAt: '2026-04-01T00:00:00Z',
              reviewSubmittedAt: '2026-03-10T00:00:00Z',
              wentLiveAt: null,
              closedAt: null,
              notes: 'Main round',
              allocationCount: 1,
              distributionCount: 1,
            },
          },
        ],
        distributions: [
          {
            id: 'distribution-1',
            title: 'Мартовская выплата',
            periodLabel: 'Март 2026',
            periodStart: '2026-03-01',
            periodEnd: '2026-03-31',
            totalAmount: 24000,
            linesCount: 1,
            status: 'approved_for_payout',
            payoutMode: 'manual',
            approvedAt: '2026-03-31T00:00:00Z',
            processedAt: null,
            paidAt: null,
            notes: 'First distribution',
            round: {} as never,
            lines: [
              {
                id: 'line-1',
                amount: 24000,
                status: 'ready',
                failureReason: null,
                paidAt: null,
                allocation: {
                  id: 'allocation-1',
                  userId: 11,
                  investorName: 'Investor Demo',
                  investorEmail: 'investor@cpf.local',
                  amount: 150000,
                  status: 'confirmed',
                  agreementUrl: null,
                  allocatedAt: '2026-03-12T00:00:00Z',
                  settledAt: null,
                  project: {} as never,
                  round: {} as never,
                },
                payoutInstruction: {
                  id: 'instruction-1',
                  distributionId: 'distribution-1',
                  distributionTitle: 'Мартовская выплата',
                  amount: 24000,
                  currency: 'RUB',
                  direction: 'investor_distribution',
                  gateway: 'manual',
                  status: 'manual_required',
                  externalId: null,
                  referenceLabel: 'Мартовская выплата · investor@cpf.local',
                  failureReason: 'Автоматическую выплату запустить не удалось. Нужны реквизиты получателя.',
                  processedAt: '2026-03-31T12:00:00Z',
                },
              },
            ],
          },
        ],
        metrics: {
          allocationCount: 1,
          confirmedAmount: 150000,
          distributedAmount: 24000,
        },
      },
    },
  },
  ownerProjectsQuery: {
    isPending: false,
    isError: false,
    data: {
      data: [
        {
          id: 'project-1',
          slug: 'galleria-moscow',
          title: 'Галерея Москва',
          excerpt: 'excerpt',
          description: 'description',
          thesis: 'thesis',
          riskSummary: 'risks',
          location: 'Москва',
          assetType: 'commercial_real_estate',
          status: 'published',
          fundingStatus: 'collecting',
          riskLevel: 'moderate',
          payoutFrequency: 'monthly',
          minInvestment: 10000,
          targetAmount: 30000000,
          currentAmount: 16200000,
          targetYield: 18.5,
          termMonths: 24,
          coverImageUrl: null,
          heroMetric: null,
          isFeatured: true,
          publishedAt: '2026-03-01T00:00:00Z',
          fundingProgress: 54,
          documents: [],
        },
      ],
    },
  },
  submitRoundMutation: { mutateAsync: vi.fn(async () => ({})), isPending: false },
  goLiveMutation: { mutateAsync: vi.fn(async () => ({})), isPending: false },
  closeMutation: { mutateAsync: vi.fn(async () => ({})), isPending: false },
  approveDistributionMutation: { mutateAsync: vi.fn(async () => ({})), isPending: false },
  runPayoutsMutation: { mutateAsync: vi.fn(async () => ({})), isPending: false },
  ownerPayoutsQuery: {
    isPending: false,
    isError: false,
    data: {
      data: [
        {
          id: 'instruction-1',
          distributionId: 'distribution-1',
          distributionTitle: 'Мартовская выплата',
          amount: 24000,
          currency: 'RUB',
          direction: 'investor_distribution',
          gateway: 'manual',
          status: 'manual_required',
          externalId: null,
          referenceLabel: 'Мартовская выплата · investor@cpf.local',
          failureReason: 'Автоматическую выплату запустить не удалось. Нужны реквизиты получателя.',
          processedAt: '2026-03-31T12:00:00Z',
        },
        {
          id: 'instruction-2',
          distributionId: 'distribution-2',
          distributionTitle: 'Апрельская выплата',
          amount: 18000,
          currency: 'RUB',
          direction: 'investor_distribution',
          gateway: 'yookassa_payout',
          status: 'succeeded',
          externalId: 'payout-demo-2',
          referenceLabel: 'Апрельская выплата · investor@cpf.local',
          failureReason: null,
          processedAt: '2026-04-30T12:00:00Z',
        },
      ],
    },
  },
  dashboardQuery: {
    isPending: false,
    data: {
      data: {
        summary: {
          applicationsCount: 2,
          allocationsCount: 1,
          portfolioAmount: 150000,
          approvedAmount: 150000,
          pendingAmount: 50000,
          distributionsAmount: 24000,
          walletBalance: 350000,
          pendingWithdrawals: 0,
          unreadNotifications: 1,
          kycStatus: 'approved',
        },
        applications: [
          {
            id: 'investment-1',
            amount: 150000,
            status: 'confirmed',
            notes: null,
            project: {
              id: 'project-1',
              slug: 'galleria-moscow',
              title: 'Галерея Москва',
              excerpt: 'excerpt',
              description: 'description',
              thesis: 'thesis',
              riskSummary: 'risks',
              location: 'Москва',
              assetType: 'commercial_real_estate',
              status: 'published',
              fundingStatus: 'collecting',
              riskLevel: 'moderate',
              payoutFrequency: 'monthly',
              minInvestment: 10000,
              targetAmount: 30000000,
              currentAmount: 16200000,
              targetYield: 18.5,
              termMonths: 24,
              coverImageUrl: null,
              heroMetric: null,
              isFeatured: true,
              publishedAt: '2026-03-01T00:00:00Z',
              fundingProgress: 54,
              documents: [],
            },
            round: {
              id: 'round-1',
              slug: 'galleria-moscow-main-round',
              title: 'Основной Раунд',
              status: 'live',
              projectId: 'project-1',
              projectSlug: 'galleria-moscow',
              projectTitle: 'Галерея Москва',
            },
            createdAt: '2026-03-10T00:00:00Z',
          },
        ],
        allocations: [
          {
            id: 'allocation-1',
            userId: 11,
            investorName: 'Investor Demo',
            investorEmail: 'investor@cpf.local',
            amount: 150000,
            status: 'confirmed',
            agreementUrl: null,
            allocatedAt: '2026-03-12T00:00:00Z',
            settledAt: null,
            project: {
              id: 'project-1',
              slug: 'galleria-moscow',
              title: 'Галерея Москва',
              excerpt: 'excerpt',
              description: 'description',
              thesis: 'thesis',
              riskSummary: 'risks',
              location: 'Москва',
              assetType: 'commercial_real_estate',
              status: 'published',
              fundingStatus: 'collecting',
              riskLevel: 'moderate',
              payoutFrequency: 'monthly',
              minInvestment: 10000,
              targetAmount: 30000000,
              currentAmount: 16200000,
              targetYield: 18.5,
              termMonths: 24,
              coverImageUrl: null,
              heroMetric: null,
              isFeatured: true,
              publishedAt: '2026-03-01T00:00:00Z',
              fundingProgress: 54,
              documents: [],
            },
            round: {
              id: 'round-1',
              slug: 'galleria-moscow-main-round',
              title: 'Основной Раунд',
              status: 'live',
              projectId: 'project-1',
              projectSlug: 'galleria-moscow',
              projectTitle: 'Галерея Москва',
              payoutFrequency: 'monthly',
            },
          },
        ],
        distributionLines: [
          {
            id: 'line-1',
            amount: 24000,
            status: 'pending_payout',
            failureReason: null,
            paidAt: null,
            allocation: {
              id: 'allocation-1',
              userId: 11,
              investorName: 'Investor Demo',
              investorEmail: 'investor@cpf.local',
              amount: 150000,
              status: 'confirmed',
              agreementUrl: null,
              allocatedAt: '2026-03-12T00:00:00Z',
              settledAt: null,
              project: {
                id: 'project-1',
                slug: 'galleria-moscow',
                title: 'Галерея Москва',
                excerpt: 'excerpt',
                description: 'description',
                thesis: 'thesis',
                riskSummary: 'risks',
                location: 'Москва',
                assetType: 'commercial_real_estate',
                status: 'published',
                fundingStatus: 'collecting',
                riskLevel: 'moderate',
                payoutFrequency: 'monthly',
                minInvestment: 10000,
                targetAmount: 30000000,
                currentAmount: 16200000,
                targetYield: 18.5,
                termMonths: 24,
                coverImageUrl: null,
                heroMetric: null,
                isFeatured: true,
                publishedAt: '2026-03-01T00:00:00Z',
                fundingProgress: 54,
                documents: [],
              },
              round: {
                id: 'round-1',
                slug: 'galleria-moscow-main-round',
                title: 'Основной Раунд',
                status: 'live',
                projectId: 'project-1',
                projectSlug: 'galleria-moscow',
                projectTitle: 'Галерея Москва',
                payoutFrequency: 'monthly',
              },
            },
            payoutInstruction: {
              id: 'instruction-1',
              amount: 24000,
              currency: 'RUB',
              direction: 'investor_distribution',
              gateway: 'manual',
              status: 'manual_required',
              distributionId: 'distribution-1',
              distributionTitle: 'Мартовская выплата',
              externalId: null,
              referenceLabel: 'Мартовская выплата · investor@cpf.local',
              failureReason: 'Автоматическую выплату запустить не удалось. Нужны реквизиты получателя.',
              processedAt: '2026-03-31T12:00:00Z',
            },
          },
        ],
        transactions: [],
        walletTransactions: [],
        withdrawals: [],
      },
    },
  },
  agreementMutation: { mutateAsync: vi.fn(async () => ({ data: { agreementUrl: 'https://example.com' } })), isPending: false, isError: false, error: null },
  confirmMutation: { mutateAsync: vi.fn(async () => ({ data: { status: 'confirmed' } })), isPending: false, isError: false, error: null },
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

vi.mock('sonner', () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError,
  },
}));

vi.mock('@/features/session/model/use-session', () => ({
  useSession: () => ({
    token: 'token',
    user: null,
    isAuthenticated: true,
    isLoading: false,
    isError: false,
    error: null,
    setToken: vi.fn(),
    clearToken: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('@/entities/owner-project/api/hooks', () => ({
  useOwnerProjectsQuery: () => mocks.ownerProjectsQuery,
}));

vi.mock('@/entities/owner-round/api/hooks', () => ({
  useOwnerRoundQuery: () => mocks.ownerRoundQuery,
  useSubmitOwnerRoundForReviewMutation: () => mocks.submitRoundMutation,
  useGoLiveOwnerRoundMutation: () => mocks.goLiveMutation,
  useCloseOwnerRoundMutation: () => mocks.closeMutation,
  useApproveOwnerDistributionMutation: () => mocks.approveDistributionMutation,
  useRunOwnerDistributionPayoutsMutation: () => mocks.runPayoutsMutation,
}));

vi.mock('@/entities/owner-payout/api/hooks', () => ({
  useOwnerPayoutsQuery: () => mocks.ownerPayoutsQuery,
}));

vi.mock('@/entities/cabinet/api/hooks', () => ({
  useDashboardQuery: () => mocks.dashboardQuery,
  useInvestmentAgreementMutation: () => mocks.agreementMutation,
  useConfirmInvestmentMutation: () => mocks.confirmMutation,
}));

vi.mock('@/features/owner-round/ui/owner-round-form', () => ({
  OwnerRoundForm: () => <div data-testid="owner-round-form">owner round form</div>,
}));

vi.mock('@/features/owner-round/ui/owner-distribution-form', () => ({
  OwnerDistributionForm: () => <div data-testid="owner-distribution-form">owner distribution form</div>,
}));

describe('owner & investor flow pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders payout queue with manual reason and totals', () => {
    render(<OwnerPayoutsPage />);

    expect(screen.getByText('Очередь выплат')).toBeInTheDocument();
    expect(screen.getByText('Нужна проверка')).toBeInTheDocument();
    expect(screen.getByText('Мартовская выплата')).toBeInTheDocument();
    expect(screen.getByText('Автоматическую выплату запустить не удалось. Нужны реквизиты получателя.')).toBeInTheDocument();
  });

  it('allows owner to send round live from details page', async () => {
    const user = userEvent.setup();

    render(<OwnerRoundDetailsPage slug="galleria-moscow-main-round" />);

    expect(screen.getByText('Подтвержденные участники')).toBeInTheDocument();
    expect(screen.getByTestId('owner-round-form')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Открыть сбор' }));
    await user.click(screen.getAllByRole('button', { name: 'Открыть сбор' })[1]);

    expect(mocks.goLiveMutation.mutateAsync).toHaveBeenCalledWith({
      slug: 'galleria-moscow-main-round',
    });
  });

  it('shows investor allocations and distribution lines in portfolio page', () => {
    render(<DashboardPortfolioPage />);

    expect(screen.getByText('Подтвержденные участия')).toBeInTheDocument();
    expect(screen.getByText('Начисления и выплаты')).toBeInTheDocument();
    expect(screen.getAllByText('Галерея Москва').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Мартовская выплата').length).toBeGreaterThan(0);
    expect(screen.getByText('Автоматическую выплату запустить не удалось. Нужны реквизиты получателя.')).toBeInTheDocument();
  });
});
