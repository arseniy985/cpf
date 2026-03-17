function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

export function getBackendApiOrigin() {
  const value = process.env.API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!value) {
    throw new Error('API base URL is not configured.');
  }

  return trimTrailingSlash(value);
}
