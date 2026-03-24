function sanitizeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .trim();
}

function buildProjectCoverPlaceholder(title?: string | null, accent?: string | null) {
  const safeTitle = sanitizeSvgText(title || 'CPF Project');
  const safeAccent = sanitizeSvgText(accent || 'Structured opportunity');

  return [
    'data:image/svg+xml;charset=UTF-8,',
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none">
        <defs>
          <linearGradient id="bg" x1="64" y1="56" x2="1094" y2="744" gradientUnits="userSpaceOnUse">
            <stop stop-color="#0f2347" />
            <stop offset="0.58" stop-color="#183e7a" />
            <stop offset="1" stop-color="#d8e8ff" />
          </linearGradient>
          <linearGradient id="panel" x1="160" y1="160" x2="950" y2="640" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ffffff" stop-opacity="0.18" />
            <stop offset="1" stop-color="#ffffff" stop-opacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#bg)" />
        <circle cx="1020" cy="116" r="176" fill="#7dd3fc" fill-opacity="0.18" />
        <circle cx="196" cy="692" r="244" fill="#bae6fd" fill-opacity="0.12" />
        <rect x="92" y="92" width="1016" height="616" rx="44" fill="url(#panel)" stroke="#ffffff" stroke-opacity="0.16" />
        <path d="M198 568L380 430L532 512L736 324L940 470" stroke="#ffffff" stroke-opacity="0.88" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="380" cy="430" r="18" fill="#d8e8ff" />
        <circle cx="736" cy="324" r="18" fill="#d8e8ff" />
        <rect x="144" y="146" width="148" height="40" rx="20" fill="#7dd3fc" fill-opacity="0.22" />
        <text x="164" y="173" fill="#d8e8ff" font-family="Arial, sans-serif" font-size="24" font-weight="700">CPF</text>
        <text x="144" y="270" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="700">${safeTitle}</text>
        <text x="144" y="330" fill="#c4dcff" font-family="Arial, sans-serif" font-size="30">${safeAccent}</text>
        <text x="144" y="628" fill="#d8e8ff" font-family="Arial, sans-serif" font-size="22">Partner finance • Local SVG cover</text>
      </svg>
    `),
  ].join('');
}

function isAllowedProjectCoverSource(coverImageUrl: string) {
  return coverImageUrl.startsWith('/') || coverImageUrl.startsWith('data:image/');
}

function getProjectAccent(title?: string | null) {
  const value = (title || '').toLowerCase();

  if (value.includes('склад') || value.includes('логист')) {
    return 'Logistics & cashflow';
  }

  if (value.includes('галере') || value.includes('торгов')) {
    return 'Retail & tenant mix';
  }

  if (value.includes('office') || value.includes('plaza')) {
    return 'Commercial real estate';
  }

  return 'Structured opportunity';
}

export function getProjectCoverImage(
  coverImageUrl: string | null | undefined,
  options?: {
    title?: string | null;
    accent?: string | null;
  },
) {
  const normalized = coverImageUrl?.trim();

  if (normalized && isAllowedProjectCoverSource(normalized)) {
    return normalized;
  }

  return buildProjectCoverPlaceholder(options?.title, options?.accent ?? getProjectAccent(options?.title));
}

export function getAvatarPlaceholder(label: string) {
  const safeLabel = sanitizeSvgText(label);
  const initial = sanitizeSvgText(label.trim().charAt(0).toUpperCase() || 'C');

  return [
    'data:image/svg+xml;charset=UTF-8,',
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" fill="none">
        <defs>
          <linearGradient id="avatar" x1="12" y1="10" x2="78" y2="84" gradientUnits="userSpaceOnUse">
            <stop stop-color="#d8e8ff" />
            <stop offset="1" stop-color="#1d4ed8" />
          </linearGradient>
        </defs>
        <rect width="96" height="96" rx="48" fill="url(#avatar)" />
        <circle cx="48" cy="48" r="44" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2" />
        <text x="48" y="56" text-anchor="middle" fill="#0f2347" font-family="Arial, sans-serif" font-size="34" font-weight="700">${initial}</text>
        <title>${safeLabel}</title>
      </svg>
    `),
  ].join('');
}
