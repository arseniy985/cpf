import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ContactRequestForm } from '@/features/contact-request/ui/contact-request-form';

const mocks = vi.hoisted(() => ({
  contactMutation: {
    mutateAsync: vi.fn(async () => ({ data: { id: 'lead-1', status: 'new' } })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
}));

vi.mock('@/features/contact-request/api/contact-request', () => ({
  useContactLeadMutation: () => mocks.contactMutation,
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
});
