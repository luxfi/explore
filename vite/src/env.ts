// Runtime env resolution for the Vite SPA.
//
// The Next.js app injected envs via /assets/envs.js (generated at container
// startup by deploy/scripts/make_envs_script.sh). For the SPA we keep the same
// shape — envs.js sets window.__envs — and fall back to Vite build-time
// import.meta.env so local `pnpm dev` works without the shell script.

declare global {
  interface Window {
    __envs?: Record<string, string>;
  }
}

const runtime = (): Record<string, string> => window.__envs ?? {};

export function env(key: string, fallback = ''): string {
  const r = runtime()[key];
  if (r !== undefined && r !== '') return r;
  const b = (import.meta.env as Record<string, string | undefined>)[key];
  return b ?? fallback;
}

// Derive the backend REST base URL. In the Next.js app this was set via
// NEXT_PUBLIC_API_HOST + NEXT_PUBLIC_API_BASE_PATH and proxied through
// /node-api/* by next.config.js rewrites. For the SPA we hit it directly with
// CORS, so the gateway must enable it.
export function apiBaseUrl(): string {
  const explicit = env('VITE_API_BASE_URL');
  if (explicit) return explicit.replace(/\/$/, '');

  const host = env('NEXT_PUBLIC_API_HOST') || env('VITE_API_HOST');
  const proto = env('NEXT_PUBLIC_API_PROTOCOL') || env('VITE_API_PROTOCOL') || 'https';
  const basePath = env('NEXT_PUBLIC_API_BASE_PATH') || '';
  if (!host) return '';
  return `${ proto }://${ host }${ basePath }`.replace(/\/$/, '');
}

// RPC URL for direct wallet/chain calls (e.g. viem/wagmi).
export function rpcUrl(): string {
  return env('VITE_RPC_URL') || env('NEXT_PUBLIC_NETWORK_RPC_URL') || '';
}

// Chain id for wallet connect + signature binding.
export function chainId(): number {
  const raw = env('VITE_CHAIN_ID') || env('NEXT_PUBLIC_NETWORK_ID') || '0';
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}
