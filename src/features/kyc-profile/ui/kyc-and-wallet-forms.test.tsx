import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { DepositFundsForm } from '@/features/deposit-funds/ui/deposit-funds-form';
import { KycDocumentUploadForm } from '@/features/kyc-document-upload/ui/kyc-document-upload-form';
import { KycProfileForm } from '@/features/kyc-profile/ui/kyc-profile-form';
import { ManualDepositForm } from '@/features/manual-deposit/ui/manual-deposit-form';
import { ManualDepositReceiptForm } from '@/features/manual-deposit/ui/manual-deposit-receipt-form';
import { WithdrawFundsForm } from '@/features/withdraw-funds/ui/withdraw-funds-form';

const mocks = vi.hoisted(() => ({
  upsertKycMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'kyc-1' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  uploadKycMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'doc-1' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  depositMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'payment-1', confirmationUrl: 'https://pay.test' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  withdrawalMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'withdraw-1' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  manualDepositMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'manual-1' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  manualReceiptMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'manual-1', status: 'under_review' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
}));

vi.mock('@/entities/cabinet/api/hooks', () => ({
  useUpsertKycProfileMutation: () => mocks.upsertKycMutation,
  useUploadKycDocumentMutation: () => mocks.uploadKycMutation,
  useCreateDepositMutation: () => mocks.depositMutation,
  useCreateWithdrawalMutation: () => mocks.withdrawalMutation,
  useCreateManualDepositMutation: () => mocks.manualDepositMutation,
  useUploadManualDepositReceiptMutation: () => mocks.manualReceiptMutation,
}));

describe('kyc and wallet forms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  it('submits kyc profile payload', async () => {
    const user = userEvent.setup();

    render(<KycProfileForm profile={null} />);

    await user.type(screen.getByLabelText('ФИО как в документе'), 'Иван Иванов');
    await user.type(screen.getByLabelText('ИНН'), '1234567890');
    await user.click(screen.getByRole('button', { name: 'Сохранить анкету' }));

    expect(mocks.upsertKycMutation.mutateAsync).toHaveBeenCalledWith({
      legal_name: 'Иван Иванов',
      birth_date: undefined,
      tax_id: '1234567890',
      document_number: undefined,
      address: undefined,
      notes: undefined,
    });
  });

  it('uploads selected kyc document', async () => {
    const user = userEvent.setup();
    const file = new File(['passport'], 'passport.pdf', { type: 'application/pdf' });

    render(<KycDocumentUploadForm />);

    await user.upload(screen.getByLabelText('Файл'), file);
    await user.click(screen.getByRole('button', { name: 'Загрузить документ' }));

    expect(mocks.uploadKycMutation.mutateAsync).toHaveBeenCalledWith({
      kind: 'passport',
      file,
    });
  });

  it('creates deposit and opens payment confirmation url', async () => {
    const user = userEvent.setup();

    render(<DepositFundsForm />);

    await user.clear(screen.getByLabelText('Сумма пополнения'));
    await user.type(screen.getByLabelText('Сумма пополнения'), '25000');
    await user.click(screen.getByRole('button', { name: 'Перейти к оплате' }));

    expect(mocks.depositMutation.mutateAsync).toHaveBeenCalledWith({
      amount: 25000,
    });
    expect(window.open).toHaveBeenCalledWith('https://pay.test', '_blank', 'noopener,noreferrer');
  });

  it('creates withdrawal request with manual payout payload', async () => {
    const user = userEvent.setup();

    render(<WithdrawFundsForm />);

    await user.clear(screen.getByLabelText('Сумма вывода'));
    await user.type(screen.getByLabelText('Сумма вывода'), '15000');
    await user.type(screen.getByLabelText('Комментарий для оператора'), 'Срочно');
    await user.click(screen.getByRole('button', { name: 'Отправить заявку' }));

    expect(mocks.withdrawalMutation.mutateAsync).toHaveBeenCalledWith({
      amount: 15000,
      bank_name: 'Т-Банк',
      bank_account: '2200700000000000',
      comment: 'Срочно',
    });
  });

  it('creates manual deposit request with payer data', async () => {
    const user = userEvent.setup();

    render(<ManualDepositForm />);

    await user.clear(screen.getByLabelText('Сумма перевода'));
    await user.type(screen.getByLabelText('Сумма перевода'), '45000');
    await user.type(screen.getByLabelText('Плательщик'), 'Investor Demo');
    await user.type(screen.getByLabelText('Банк плательщика'), 'Т-Банк');
    await user.type(screen.getByLabelText('Последние 4 цифры счёта'), '5501');
    await user.click(screen.getByRole('button', { name: 'Получить реквизиты для перевода' }));

    expect(mocks.manualDepositMutation.mutateAsync).toHaveBeenCalledWith({
      amount: 45000,
      payer_name: 'Investor Demo',
      payer_bank: 'Т-Банк',
      payer_account_last4: '5501',
      comment: undefined,
    });
  });

  it('uploads manual deposit receipt', async () => {
    const user = userEvent.setup();
    const file = new File(['receipt'], 'manual-topup.pdf', { type: 'application/pdf' });

    render(<ManualDepositReceiptForm requestId="manual-1" />);

    await user.upload(screen.getByLabelText('Подтверждение перевода'), file);
    await user.click(screen.getByRole('button', { name: 'Отправить чек менеджеру' }));

    expect(mocks.manualReceiptMutation.mutateAsync).toHaveBeenCalledWith({
      id: 'manual-1',
      file,
    });
  });
});
