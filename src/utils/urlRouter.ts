/**
 * Helper to extract store handle from URL:
 * Supports:
 * - https://call.zadtoo.com/@al-riyadh-store
 * - https://call.zadtoo.com/@store-name
 * - https://call.zadtoo.com/call/@al-riyadh-store
 * - https://call.zadtoo.com/?store=al-riyadh-store
 * - https://call.zadtoo.com/?to=@al-riyadh-store
 * - https://call.zadtoo.com/?call=@al-riyadh-store
 * - https://call.zadtoo.com/#/@al-riyadh-store
 * - https://call.zadtoo.com/#al-riyadh-store
 */
export function getStoreSlugFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Check Search Query Parameters (?call=..., ?store=..., ?to=..., ?handle=...)
  try {
    const params = new URLSearchParams(window.location.search || '');
    const querySlug = params.get('to') || params.get('store') || params.get('call') || params.get('handle') || params.get('brand');
    if (querySlug) {
      const clean = querySlug.replace(/^@/, '').trim().toLowerCase();
      if (clean && !isSystemRoute(clean)) {
        return clean;
      }
    }
  } catch {}

  // 2. Check Hash Route (#/@al-riyadh-store, #/al-riyadh-store, #al-riyadh-store)
  try {
    const rawHash = window.location.hash || '';
    if (rawHash) {
      const cleanHash = rawHash.replace(/^#\/?/, '').trim();
      const hashAtMatch = cleanHash.match(/@([a-zA-Z0-9_\u0600-\u06FF-]+)/);
      if (hashAtMatch && hashAtMatch[1]) {
        return hashAtMatch[1].toLowerCase();
      }
      const directSlug = cleanHash.replace(/^@/, '').toLowerCase();
      if (directSlug && !isSystemRoute(directSlug)) {
        return directSlug;
      }
    }
  } catch {}

  // 3. Check Pathname (/@al-riyadh-store, /call/@al-riyadh-store, etc.)
  try {
    const pathname = decodeURIComponent(window.location.pathname || '').trim();

    // Direct /@handle match
    const atMatch = pathname.match(/@([a-zA-Z0-9_\u0600-\u06FF-]+)/);
    if (atMatch && atMatch[1]) {
      return atMatch[1].toLowerCase();
    }

    // Single segment /slug (e.g. /al-riyadh-store)
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1) {
      const seg = segments[0].replace(/^@/, '').toLowerCase();
      if (!isSystemRoute(seg)) {
        return seg;
      }
    } else if (segments.length >= 2 && (segments[0] === 'call' || segments[0] === 'store')) {
      const seg = segments[1].replace(/^@/, '').toLowerCase();
      if (!isSystemRoute(seg)) {
        return seg;
      }
    }
  } catch {}

  return null;
}

function isSystemRoute(slug: string): boolean {
  const systemRoutes = [
    '',
    '/',
    'index.html',
    'admin',
    'login',
    'dashboard',
    'settings',
    'api',
    'assets',
    'public',
    'favicon.ico',
    'robots.txt'
  ];
  return systemRoutes.includes(slug.toLowerCase());
}
