// White-label brand detection.
//
// Source code in this repo is Lux-only. Per-chain identity (Zoo / Hanzo / SPC /
// Pars subnets on Lux primary network) is rendered with each chain's logo and
// name as network metadata — see `configs/app/chainRegistry.ts`. The explorer
// brand itself is always Lux.
//
// External operators running their own EVM chain can deploy this image as an
// unbranded ("other") explorer by setting NEXT_PUBLIC_BRAND=other plus the
// NEXT_PUBLIC_NETWORK_* env vars (see `.env.example.external`). They MUST
// supply their own brand strings at runtime — none are hardcoded here.

import { getEnvValue } from 'configs/app/utils';

export type WhiteLabelBrand = 'lux' | 'other';

const BRAND_HOSTNAME_SUFFIXES: ReadonlyArray<{ readonly suffix: string; readonly brand: WhiteLabelBrand }> = [
  { suffix: '.lux.network', brand: 'lux' },
  { suffix: '.lux.build', brand: 'lux' },
  { suffix: '.lux-test.network', brand: 'lux' },
  { suffix: '.lux-dev.network', brand: 'lux' },
];

export function getWhiteLabelBrand(hostname?: string): WhiteLabelBrand {
  // 1. Explicit env var wins (CI/CD, k8s ConfigMap)
  const envBrand = getEnvValue('NEXT_PUBLIC_BRAND');
  if (envBrand) {
    const normalized = envBrand.toLowerCase();
    if (normalized === 'lux' || normalized === 'other') {
      return normalized;
    }
    // Any unknown brand string → 'other' (env-driven white-label)
    return 'other';
  }

  // 2. Hostname-based detection
  const host = (hostname || (typeof window !== 'undefined' ? window.location.hostname : '')).toLowerCase();
  if (host) {
    for (const entry of BRAND_HOSTNAME_SUFFIXES) {
      if (host === entry.suffix.slice(1) || host.endsWith(entry.suffix)) {
        return entry.brand;
      }
    }
  }

  // 3. Default
  return 'lux';
}

export function isWhiteLabelExternal(brand: WhiteLabelBrand): boolean {
  return brand === 'other';
}
