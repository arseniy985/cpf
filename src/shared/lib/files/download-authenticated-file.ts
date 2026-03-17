import { buildApiUrl } from '@/shared/api/http/client';

function normalizeDownloadUrl(url: string) {
  if (url.startsWith('http')) {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  }

  return url;
}

export async function downloadAuthenticatedFile({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) {
  const targetUrl = buildApiUrl(normalizeDownloadUrl(url));
  const response = await fetch(targetUrl, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Не удалось скачать файл.');
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);
}
