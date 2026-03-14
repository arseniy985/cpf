import type { EmailCodePurpose } from '@/entities/viewer/api/types';
import { isLoginCodeRequired, isRegistrationCodeRequired } from '@/shared/config/auth';

export type AuthMode = 'login' | 'register';
export type AuthStep = 'credentials' | 'code' | 'recovery';

export type VerificationContext = {
  email: string;
  purpose: EmailCodePurpose;
};

export function getAuthPageCopy(mode: AuthMode) {
  if (mode === 'register') {
    const registerRequiresCode = isRegistrationCodeRequired();

    return {
      title: 'Создайте кабинет инвестора',
      subtitle: registerRequiresCode
        ? 'После регистрации отправим код подтверждения на email. После проверки откроется доступ к кабинету.'
        : 'Заполните данные, чтобы сразу создать кабинет и перейти в рабочую зону платформы.',
      alternateHref: '/login',
      alternateLabel: 'Уже есть кабинет? Войти',
      submitLabel: registerRequiresCode ? 'Продолжить и получить код' : 'Создать кабинет',
    };
  }

  const loginRequiresCode = isLoginCodeRequired();

  return {
    title: loginRequiresCode ? 'Вход по email-коду' : 'Вход в личный кабинет',
    subtitle: loginRequiresCode
      ? 'Сначала проверяем пароль, затем отправляем одноразовый код на email.'
      : 'Введите email и пароль, чтобы сразу перейти в личный кабинет.',
    alternateHref: '/register',
    alternateLabel: 'Нет кабинета? Зарегистрироваться',
    submitLabel: loginRequiresCode ? 'Отправить код для входа' : 'Войти',
  };
}
