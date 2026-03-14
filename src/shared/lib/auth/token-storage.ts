const TOKEN_KEY = 'cpf.auth.token';
const TOKEN_EVENT = 'cpf:auth-token-change';

function emitTokenChange() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(TOKEN_EVENT));
}

export function getAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
  emitTokenChange();
}

export function clearAuthToken() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
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
