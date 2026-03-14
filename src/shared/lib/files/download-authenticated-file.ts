import { buildApiUrl } from '@/shared/api/http/client';
import { getAuthToken } from '@/shared/lib/auth/token-storage';

export async function downloadAuthenticatedFile({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Требуется авторизация.');
  }

  const targetUrl = url.startsWith('http') ? url : buildApiUrl(url);
  const response = await fetch(targetUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
