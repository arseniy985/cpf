const fallbackProjectCoverImage = [
  'data:image/svg+xml;charset=UTF-8,',
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none">
      <defs>
        <linearGradient id="bg" x1="120" y1="80" x2="1080" y2="720" gradientUnits="userSpaceOnUse">
          <stop stop-color="#102a5d" />
          <stop offset="1" stop-color="#d9e8ff" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)" />
      <rect x="92" y="96" width="1016" height="608" rx="40" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.18" />
      <path d="M216 608L396 432L520 540L710 334L920 560" stroke="#ffffff" stroke-opacity="0.85" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="396" cy="432" r="24" fill="#d9e8ff" />
      <circle cx="710" cy="334" r="24" fill="#d9e8ff" />
      <text x="144" y="188" fill="#ffffff" font-family="Arial, sans-serif" font-size="42" font-weight="700">CPF</text>
      <text x="144" y="244" fill="#d9e8ff" font-family="Arial, sans-serif" font-size="28">Project cover placeholder</text>
    </svg>
  `),
].join('');

export function getProjectCoverImage(coverImageUrl: string | null | undefined) {
  return coverImageUrl?.trim() ? coverImageUrl : fallbackProjectCoverImage;
}
