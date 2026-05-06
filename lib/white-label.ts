// White-label brand detection.
//
// Source code in this repo is brand-neutral. Brand selection happens at
// deploy time via `NEXT_PUBLIC_BRAND` env var or by hostname inspection.
// All brand-specific assets (logo, title, favicon, color theme, IAM URL)
// load from `NEXT_PUBLIC_*` env vars — no hardcoded brand strings here.
//
// Supported brands:
//   - lux       (default)
//   - hanzo
//   - zoo
//   - pars
//   - other     (any external white-label deploy: branding from env vars)
//
// External deployments select their brand by setting NEXT_PUBLIC_BRAND in
// the runtime environment. They do NOT add their brand here — keeping this
// repo free of any third-party trademarks.

import { getEnvValue } from 'configs/app/utils';

export type WhiteLabelBrand = 'lux' | 'hanzo' | 'zoo' | 'pars' | 'other';

const BRAND_HOSTNAME_SUFFIXES: ReadonlyArray<{ readonly suffix: string; readonly brand: WhiteLabelBrand }> = [
  { suffix: '.lux.network', brand: 'lux' },
  { suffix: '.lux.build', brand: 'lux' },
  { suffix: '.hanzo.ai', brand: 'hanzo' },
  { suffix: '.hanzo.network', brand: 'hanzo' },
  { suffix: '.zoo.ngo', brand: 'zoo' },
  { suffix: '.zoo.network', brand: 'zoo' },
  { suffix: '.pars.network', brand: 'pars' },
];

export function getWhiteLabelBrand(hostname?: string): WhiteLabelBrand {
  // 1. Explicit env var wins (CI/CD, k8s ConfigMap)
  const envBrand = getEnvValue('NEXT_PUBLIC_BRAND');
  if (envBrand) {
    const normalized = envBrand.toLowerCase();
    if (
      normalized === 'lux' ||
      normalized === 'hanzo' ||
      normalized === 'zoo' ||
      normalized === 'pars' ||
      normalized === 'other'
    ) {
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
