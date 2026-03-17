import { AUTH_CLIENT_TOKEN_COOKIE, AUTH_PRESENCE_COOKIE } from '@/shared/config/session';

const TOKEN_EVENT = 'cpf:auth-token-change';

function emitTokenChange() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(TOKEN_EVENT));
}

function buildCookieAttributes(maxAge: number) {
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';

  return `Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function getCookieValue(name: string) {
  if (typeof document === 'undefined') {
    return null;
  }

  const encodedName = `${name}=`;
  const match = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(encodedName));

  return match ? decodeURIComponent(match.slice(encodedName.length)) : null;
}

function setAuthPresenceCookie(isPresent: boolean) {
  if (typeof document === 'undefined') {
    return;
  }

  if (isPresent) {
    document.cookie = `${AUTH_PRESENCE_COOKIE}=1; ${buildCookieAttributes(60 * 60 * 24 * 365)}`;
    return;
  }

  document.cookie = `${AUTH_PRESENCE_COOKIE}=; ${buildCookieAttributes(0)}`;
}

function setClientAuthTokenCookie(token: string | null) {
  if (typeof document === 'undefined') {
    return;
  }

  if (token) {
    document.cookie = `${AUTH_CLIENT_TOKEN_COOKIE}=${encodeURIComponent(token)}; ${buildCookieAttributes(60 * 60 * 24 * 30)}`;
    return;
  }

  document.cookie = `${AUTH_CLIENT_TOKEN_COOKIE}=; ${buildCookieAttributes(0)}`;
}

export function getClientAuthToken() {
  return getCookieValue(AUTH_CLIENT_TOKEN_COOKIE);
}

export function getAuthSessionMarker() {
  return getClientAuthToken() ?? getCookieValue(AUTH_PRESENCE_COOKIE);
}

export function hasAuthSession() {
  return Boolean(getAuthSessionMarker());
}

export function setAuthToken(token?: string | null) {
  if (typeof document === 'undefined') {
    return;
  }

  setClientAuthTokenCookie(token ?? null);
  setAuthPresenceCookie(true);
  emitTokenChange();
}

export function clearAuthToken() {
  if (typeof document === 'undefined') {
    return;
  }

  setClientAuthTokenCookie(null);
  setAuthPresenceCookie(false);
  emitTokenChange();
}

export function subscribeAuthToken(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener(TOKEN_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(TOKEN_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
