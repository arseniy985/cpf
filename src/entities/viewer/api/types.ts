import type { OwnerAccountSummary } from '@/entities/owner-account/api/types';

export type AccountType = 'investor' | 'owner';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerifiedAt: string | null;
  kycStatus: string | null;
  roles: string[];
  notificationPreferences: {
    email?: boolean;
    sms?: boolean;
    marketing?: boolean;
  } | null;
  ownerAccount: OwnerAccountSummary | null;
  investorPayoutProfile: InvestorPayoutProfile | null;
};

export type InvestorPayoutProfile = {
  id: string | null;
  provider: 'yookassa' | null;
  status: string | null;
  payoutMethodLabel: string | null;
  lastVerifiedAt: string | null;
  isReady: boolean;
};

export type EmailCodePurpose = 'verify_email' | 'login' | 'password_reset';

export type EmailCodeResponse = {
  data: {
    email: string;
    purpose: EmailCodePurpose;
    codeSent: boolean;
  };
};

export type AuthResponse = {
  data: {
    token: string;
    user: AuthUser;
  };
};

export type RegisterResponse = EmailCodeResponse | AuthResponse;
