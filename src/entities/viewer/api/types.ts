export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerifiedAt: string | null;
  kycStatus: string | null;
  roles: string[];
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
