import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ContactRequestForm } from '@/features/contact-request/ui/contact-request-form';
import { ProjectSubmissionForm } from '@/features/project-submission/ui/project-submission-form';

const mocks = vi.hoisted(() => ({
  contactMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'lead-1', status: 'new' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  projectSubmissionMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'project-1', status: 'new' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
}));

vi.mock('@/features/contact-request/api/contact-request', () => ({
  useContactLeadMutation: () => mocks.contactMutation,
}));

vi.mock('@/features/project-submission/api/project-submission', () => ({
  useProjectSubmissionMutation: () => mocks.projectSubmissionMutation,
}));

describe('lead forms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits contact request with default message and source metadata', async () => {
    const user = userEvent.setup();

    render(
      <ContactRequestForm
        source="home-hero"
        subject="Консультация"
        defaultMessage="Подберите проект"
      />,
    );

    await user.type(screen.getByLabelText('Ваше имя'), 'Иван Иванов');
    await user.type(screen.getByLabelText('Номер телефона'), '+79990000000');
    await user.type(screen.getByLabelText('Email'), 'ivan@example.com');
    await user.click(screen.getByRole('button', { name: 'Отправить заявку' }));

    expect(mocks.contactMutation.mutateAsync).toHaveBeenCalledWith({
      full_name: 'Иван Иванов',
      phone: '+79990000000',
      email: 'ivan@example.com',
      message: 'Подберите проект',
      source: 'home-hero',
      subject: 'Консультация',
    });
  });

  it('submits project submission and converts target amount to number', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<ProjectSubmissionForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText('Как к вам обращаться?'), 'Сергей');
    await user.type(screen.getByLabelText('Email'), 'sergey@example.com');
    await user.type(screen.getByLabelText('Номер телефона'), '+79990000000');
    await user.type(screen.getByLabelText('Название проекта'), 'БЦ Север');
    await user.clear(screen.getByLabelText('Целевая сумма'));
    await user.type(screen.getByLabelText('Целевая сумма'), '45000000');
    await user.click(screen.getByRole('button', { name: 'Отправить заявку' }));

    expect(mocks.projectSubmissionMutation.mutateAsync).toHaveBeenCalledWith({
      full_name: 'Сергей',
      email: 'sergey@example.com',
      phone: '+79990000000',
      company_name: undefined,
      project_name: 'БЦ Север',
      target_amount: 45000000,
      message: undefined,
      asset_type: 'commercial_real_estate',
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});
