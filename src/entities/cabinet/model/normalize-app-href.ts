export function normalizeAppHref(href: string | null | undefined) {
  if (!href) {
    return null;
  }

  if (href.startsWith('/app')) {
    return href;
  }

  if (href === '/owner' || href.startsWith('/owner/')) {
    return href.replace('/owner', '/app/owner');
  }

  if (href === '/dashboard') {
    return '/app/investor';
  }

  if (href.startsWith('/dashboard/notifications')) {
    return '/app/notifications';
  }

  if (href.startsWith('/dashboard/settings')) {
    return '/app/settings';
  }

  if (href.startsWith('/dashboard/portfolio')) {
    return href.replace('/dashboard/portfolio', '/app/investor/portfolio');
  }

  if (href.startsWith('/dashboard/wallet')) {
    return href.replace('/dashboard/wallet', '/app/investor/wallet');
  }

  if (href.startsWith('/dashboard/documents')) {
    return href.replace('/dashboard/documents', '/app/investor/documents');
  }

  if (href.startsWith('/dashboard/kyc')) {
    return href.replace('/dashboard/kyc', '/app/investor/verification');
  }

  return href;
}
