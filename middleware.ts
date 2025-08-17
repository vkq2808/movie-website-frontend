import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory cache for maintenance settings in edge runtime
let cachedSettings: { maintenanceMode?: boolean } | null = null;
let lastFetch = 0;
const CACHE_MS = 30_000; // 30s

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:2808/';
const SETTINGS_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

async function getSettings(): Promise<{ maintenanceMode?: boolean } | null> {
  const now = Date.now();
  if (cachedSettings && now - lastFetch < CACHE_MS) return cachedSettings;
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, { cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    cachedSettings = json?.data || {};
    lastFetch = now;
    return cachedSettings;
  } catch {
    return cachedSettings || null;
  }
}
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accept = request.headers.get('accept') || '';
  const isHTML = accept.includes('text/html');
  // Skip non-HTML (assets, API, data, flight)
  if (!isHTML) {
    return NextResponse.next();
  }
  // Bypass middleware for RSC/Router prefetch requests to prevent corrupting flight responses
  const isRouterPrefetch = request.headers.get('next-router-prefetch') === '1' || request.headers.get('purpose') === 'prefetch';
  const isRSC = request.headers.get('RSC') === '1' || request.headers.get('rsc') === '1';
  const isNextData = pathname.startsWith('/_next/data') || pathname.startsWith('/_next/static');
  if (isRouterPrefetch || isRSC || isNextData) {
    return NextResponse.next();
  }

  // Maintenance mode: block everything except auth and admin and maintenance page itself
  const settings = await getSettings();
  if (settings?.maintenanceMode) {
    const isPublicAllowed = pathname.startsWith('/auth') || pathname.startsWith('/maintenance') || pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname === '/favicon.ico';
    const isAdmin = pathname.startsWith('/admin');
    if (!isAdmin && !isPublicAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
