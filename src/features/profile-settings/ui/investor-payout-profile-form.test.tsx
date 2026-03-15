import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { InvestorPayoutProfileForm } from '@/features/profile-settings/ui/investor-payout-profile-form';

const mocks = vi.hoisted(() => ({
  payoutMutation: {
    mutateAsync: vi.fn(async () => ({ data: { provider: 'yookassa', isReady: true } })),
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

vi.mock('@/entities/viewer/api/hooks', () => ({
  useUpdateInvestorPayoutProfileMutation: () => mocks.payoutMutation,
}));

describe('investor payout profile form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves payout method payload for automatic payouts', async () => {
    const user = userEvent.setup();

    render(
      <InvestorPayoutProfileForm
        user={{
          id: 'user-1',
          name: 'Investor',
          email: 'investor@example.com',
          phone: null,
          emailVerifiedAt: '2026-03-15T10:00:00Z',
          kycStatus: 'approved',
          roles: ['investor'],
          ownerAccount: null,
          investorPayoutProfile: null,
        }}
      />,
    );

    await user.type(screen.getByLabelText('Название способа выплаты'), 'Основная карта');
    await user.type(screen.getByLabelText('Токен выплаты YooKassa'), 'test-secure-token');
    await user.click(screen.getByRole('button', { name: 'Сохранить способ выплаты' }));

    expect(mocks.payoutMutation.mutateAsync).toHaveBeenCalledWith({
      provider: 'yookassa',
      payout_method_label: 'Основная карта',
      payout_token: 'test-secure-token',
    });
  });
});
