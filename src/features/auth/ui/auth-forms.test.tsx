import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { CredentialsForm } from '@/features/auth/ui/credentials-form';
import { PasswordRecoveryForm } from '@/features/auth/ui/password-recovery-form';
import { VerifyCodeForm } from '@/features/auth/ui/verify-code-form';

const mocks = vi.hoisted(() => ({
  registerRequiresCode: true,
  loginRequiresCode: true,
  loginMutation: {
    mutateAsync: vi.fn(async () => ({
    data: { email: 'investor@cpf.local', purpose: 'login', codeSent: true },
    })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  registerMutation: {
    mutateAsync: vi.fn(async () => ({
    data: { email: 'new@cpf.local', purpose: 'verify_email', codeSent: true },
    })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  requestCodeMutation: {
    mutateAsync: vi.fn(async () => ({
    data: { email: 'investor@cpf.local', purpose: 'login', codeSent: true },
    })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  verifyCodeMutation: {
    mutateAsync: vi.fn(async () => ({
    data: { token: 'verified-token', user: { id: '1', name: 'User', email: 'a@b.c', phone: null, emailVerifiedAt: null, kycStatus: null, roles: [] } },
    })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  forgotMutation: {
    mutateAsync: vi.fn(async () => ({
    data: { email: 'recover@cpf.local', purpose: 'password_reset', codeSent: true },
    })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
  resetMutation: {
    mutateAsync: vi.fn(async () => ({
    data: { passwordReset: true },
    })),
    isPending: false,
    isError: false,
    isSuccess: false,
    error: null,
  },
}));

vi.mock('@/shared/config/auth', () => ({
  isRegistrationCodeRequired: () => mocks.registerRequiresCode,
  isLoginCodeRequired: () => mocks.loginRequiresCode,
}));

vi.mock('@/entities/viewer/api/hooks', () => ({
  useLoginMutation: () => mocks.loginMutation,
  useRegisterMutation: () => mocks.registerMutation,
  useRequestEmailCodeMutation: () => mocks.requestCodeMutation,
  useVerifyEmailCodeMutation: () => mocks.verifyCodeMutation,
  useForgotPasswordMutation: () => mocks.forgotMutation,
  useResetPasswordMutation: () => mocks.resetMutation,
}));

describe('auth forms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.registerRequiresCode = true;
    mocks.loginRequiresCode = true;
  });

  it('submits login credentials and moves into verification context', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(
      <CredentialsForm
        mode="login"
        alternateHref="/register"
        alternateLabel="Регистрация"
        submitLabel="Отправить код"
        onRecovery={vi.fn()}
        onSuccess={onSuccess}
      />,
    );

    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'investor@cpf.local');
    await user.click(screen.getByRole('button', { name: 'Отправить код' }));

    expect(mocks.loginMutation.mutateAsync).toHaveBeenCalledWith({
      email: 'investor@cpf.local',
      password: 'password',
      device_name: 'next-web',
    });
    expect(onSuccess).toHaveBeenCalledWith({
      kind: 'code',
      email: 'investor@cpf.local',
      purpose: 'login',
    });
  });

  it('submits registration payload with email verification purpose', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(
      <CredentialsForm
        mode="register"
        alternateHref="/login"
        alternateLabel="Вход"
        submitLabel="Продолжить"
        onRecovery={vi.fn()}
        onSuccess={onSuccess}
      />,
    );

    await user.type(screen.getByLabelText('Имя и фамилия'), 'Иван Иванов');
    await user.type(screen.getByLabelText('Email'), 'new@cpf.local');
    await user.type(screen.getByLabelText('Пароль'), 'password1');
    await user.type(screen.getByLabelText('Повторите пароль'), 'password1');
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    expect(mocks.registerMutation.mutateAsync).toHaveBeenCalledWith({
      name: 'Иван Иванов',
      email: 'new@cpf.local',
      phone: undefined,
      password: 'password1',
      password_confirmation: 'password1',
      device_name: 'next-web',
    });
    expect(onSuccess).toHaveBeenCalledWith({
      kind: 'code',
      email: 'new@cpf.local',
      purpose: 'verify_email',
    });
  });

  it('submits registration payload and authenticates directly when code is disabled', async () => {
    mocks.registerRequiresCode = false;
    mocks.registerMutation.mutateAsync.mockResolvedValueOnce({
      data: {
        token: 'direct-token',
        user: {
          id: '2',
          name: 'Direct User',
          email: 'direct@cpf.local',
          phone: null,
          emailVerifiedAt: '2026-03-13T00:00:00Z',
          kycStatus: null,
          roles: ['investor'],
        },
      },
    } as never);

    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(
      <CredentialsForm
        mode="register"
        alternateHref="/login"
        alternateLabel="Вход"
        submitLabel="Создать кабинет"
        onRecovery={vi.fn()}
        onSuccess={onSuccess}
      />,
    );

    await user.type(screen.getByLabelText('Имя и фамилия'), 'Прямой пользователь');
    await user.type(screen.getByLabelText('Email'), 'direct@cpf.local');
    await user.type(screen.getByLabelText('Пароль'), 'password1');
    await user.type(screen.getByLabelText('Повторите пароль'), 'password1');
    await user.click(screen.getByRole('button', { name: 'Создать кабинет' }));

    expect(onSuccess).toHaveBeenCalledWith({
      kind: 'authenticated',
      token: 'direct-token',
      user: {
        id: '2',
        name: 'Direct User',
        email: 'direct@cpf.local',
        phone: null,
        emailVerifiedAt: '2026-03-13T00:00:00Z',
        kycStatus: null,
        roles: ['investor'],
      },
    });
  });

  it('verifies code and allows resending code', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const onBack = vi.fn();

    render(
      <VerifyCodeForm
        context={{ email: 'investor@cpf.local', purpose: 'login' }}
        onBack={onBack}
        onSuccess={onSuccess}
      />,
    );

    await user.type(screen.getByLabelText('Код подтверждения'), '123456');
    await user.click(screen.getByRole('button', { name: 'Подтвердить и войти' }));
    await user.click(screen.getByRole('button', { name: 'Отправить код повторно' }));
    await user.click(screen.getByRole('button', { name: /Вернуться к данным/i }));

    expect(mocks.verifyCodeMutation.mutateAsync).toHaveBeenCalledWith({
      email: 'investor@cpf.local',
      code: '123456',
      purpose: 'login',
      device_name: 'next-web',
    });
    expect(onSuccess).toHaveBeenCalledWith('verified-token');
    expect(mocks.requestCodeMutation.mutateAsync).toHaveBeenCalledWith({
      email: 'investor@cpf.local',
      purpose: 'login',
    });
    expect(onBack).toHaveBeenCalled();
  });

  it('authenticates login directly when login code is disabled', async () => {
    mocks.loginRequiresCode = false;
    mocks.loginMutation.mutateAsync.mockResolvedValueOnce({
      data: {
        token: 'login-token',
        user: {
          id: '1',
          name: 'Investor',
          email: 'investor@cpf.local',
          phone: null,
          emailVerifiedAt: '2026-03-13T00:00:00Z',
          kycStatus: null,
          roles: ['investor'],
        },
      },
    } as never);

    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(
      <CredentialsForm
        mode="login"
        alternateHref="/register"
        alternateLabel="Регистрация"
        submitLabel="Войти"
        onRecovery={vi.fn()}
        onSuccess={onSuccess}
      />,
    );

    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'investor@cpf.local');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(onSuccess).toHaveBeenCalledWith({
      kind: 'authenticated',
      token: 'login-token',
      user: {
        id: '1',
        name: 'Investor',
        email: 'investor@cpf.local',
        phone: null,
        emailVerifiedAt: '2026-03-13T00:00:00Z',
        kycStatus: null,
        roles: ['investor'],
      },
    });
  });

  it('handles password recovery request and reset', async () => {
    const user = userEvent.setup();

    render(<PasswordRecoveryForm initialEmail="recover@cpf.local" onBack={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Получить код восстановления' }));

    expect(mocks.forgotMutation.mutateAsync).toHaveBeenCalledWith({
      email: 'recover@cpf.local',
    });

    await user.type(screen.getByLabelText('Код из письма'), '654321');
    await user.type(screen.getByLabelText('Новый пароль'), 'newpassword');
    await user.type(screen.getByLabelText('Повторите новый пароль'), 'newpassword');
    await user.click(screen.getByRole('button', { name: 'Сменить пароль' }));

    expect(mocks.resetMutation.mutateAsync).toHaveBeenCalledWith({
      email: 'recover@cpf.local',
      code: '654321',
      password: 'newpassword',
      password_confirmation: 'newpassword',
    });
  });
});
