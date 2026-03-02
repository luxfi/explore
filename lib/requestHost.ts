// Request-scoped hostname store for stateless SSR.
//
// Next.js pages router bakes `NEXT_PUBLIC_APP_HOST` at BUILD time — the
// same image served from 6 different hostnames would SSR with the same
// brand every time. That kills horizontal scaling because every deploy
// must be rebuilt per hostname.
//
// This store captures `req.headers.host` at the start of each SSR render
// (see `_document.tsx`), so `getHostname()` on the server returns the
// actual requested host. The same docker image now serves Lux, Zoo,
// Hanzo, SPC, Pars, and Liquidity interchangeably — one image, N hosts.
//
// Client side is unaffected: `window.location.hostname` continues to be
// the source of truth post-hydration.

import { AsyncLocalStorage } from 'async_hooks';

const store = new AsyncLocalStorage<string>();

/**
 * Run an async function with a captured request hostname. All calls to
 * `getRequestHost()` inside the callback (or transitively) will receive
 * this hostname.
 */
export function withRequestHost<T>(host: string, fn: () => Promise<T> | T): Promise<T> | T {
  return store.run(host, fn);
}

/**
 * Returns the hostname of the currently-rendering SSR request, or an
 * empty string when called outside a scoped run (e.g. during build,
 * static pages, or edge functions where no request is bound).
 */
export function getRequestHost(): string {
  return store.getStore() ?? '';
}

/**
 * Parse a raw Host header ("explore.zoo.network:3000") into just the
 * hostname part. Handles IPv4, IPv6 (bracketed), and missing port.
 */
export function parseHostHeader(hostHeader: string | undefined): string {
  if (!hostHeader) return '';
  const h = hostHeader.trim();
  // IPv6 in brackets: [::1]:3000
  if (h.startsWith('[')) {
    const end = h.indexOf(']');
    return end > 0 ? h.slice(1, end) : h;
  }
  // Strip :port
  const colon = h.lastIndexOf(':');
  if (colon > 0 && /^\d+$/.test(h.slice(colon + 1))) {
    return h.slice(0, colon);
  }
  return h;
}
