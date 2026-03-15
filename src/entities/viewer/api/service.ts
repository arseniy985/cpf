import { fetchJson } from '@/shared/api/http/client';
import type {
  AuthResponse,
  AuthUser,
  EmailCodePurpose,
  EmailCodeResponse,
  RegisterResponse,
} from './types';

type LoginPayload = {
  email: string;
  password: string;
  device_name: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  device_name: string;
};

type VerifyEmailCodePayload = {
  email: string;
  purpose: EmailCodePurpose;
  code: string;
  device_name: string;
};

export async function login(payload: LoginPayload) {
  return fetchJson<EmailCodeResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload) {
  return fetchJson<RegisterResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function requestEmailCode(payload: {
  email: string;
  purpose: EmailCodePurpose;
}) {
  return fetchJson<EmailCodeResponse>('/api/v1/auth/request-email-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyEmailCode(payload: VerifyEmailCodePayload) {
  return fetchJson<AuthResponse>('/api/v1/auth/verify-email-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(payload: { email: string }) {
  return fetchJson<EmailCodeResponse>('/api/v1/auth/password/forgot', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: {
  email: string;
  code: string;
  password: string;
  password_confirmation: string;
}) {
  return fetchJson<{ data: { passwordReset: boolean } }>('/api/v1/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchMe() {
  return fetchJson<{ data: AuthUser }>('/api/v1/auth/me', {
    requireAuth: true,
  });
}

export async function updateProfile(
  payload: {
    name: string;
    phone?: string;
    notification_preferences?: {
      email?: boolean;
      sms?: boolean;
      marketing?: boolean;
    };
  },
) {
  return fetchJson<{ data: AuthUser }>('/api/v1/me', {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateInvestorPayoutProfile(
  payload: {
    provider: 'yookassa';
    payout_method_label?: string;
    payout_token?: string;
  },
) {
  return fetchJson<{ data: AuthUser['investorPayoutProfile'] }>('/api/v1/me/payout-profile', {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function refreshToken(deviceName: string) {
  return fetchJson<AuthResponse>('/api/v1/auth/refresh', {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify({ device_name: deviceName }),
  });
}

export async function logout() {
  return fetchJson<{ data: { loggedOut: boolean } }>('/api/v1/auth/logout', {
    method: 'POST',
    requireAuth: true,
  });
}
