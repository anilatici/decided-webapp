export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const url = new URL(siteUrl);

  if (process.env.NODE_ENV !== 'production' && url.hostname === 'localhost') {
    url.hostname = '127.0.0.1';
  }

  return url;
}
