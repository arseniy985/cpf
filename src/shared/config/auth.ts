const registerWithEmailCodeEnv = process.env.NEXT_PUBLIC_AUTH_REGISTER_WITH_EMAIL_CODE;
const loginWithEmailCodeEnv = process.env.NEXT_PUBLIC_AUTH_LOGIN_WITH_EMAIL_CODE;

export function isRegistrationCodeRequired() {
  return registerWithEmailCodeEnv !== 'false';
}

export function isLoginCodeRequired() {
  return loginWithEmailCodeEnv !== 'false';
}
