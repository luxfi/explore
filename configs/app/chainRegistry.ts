// Multi-tenant chain registry. Maps hostnames to chain and network configuration.
// One Docker image serves all chains — the hostname determines the active chain.

export interface ChainBranding {

  /** Display name in the header (e.g. "Lux Network", "Zoo Chain") */
  readonly brandName: string;

  /** viewBox for the inline logo SVG */
  readonly logoViewBox: string;

  /** Inner SVG content for the inline logo (multi-path supported, uses currentColor) */
  readonly logoContent: string;

  /** Full inner SVG content for the favicon (viewBox "0 0 512 512") */
  readonly faviconContent: string;
}

export interface ChainEntry {
  readonly name: string;
  readonly label: string;
  readonly vm: string;
  readonly network: 'mainnet' | 'testnet' | 'devnet';
  readonly hostnames: ReadonlyArray<string>;
  readonly explorerUrl: string;
  readonly apiUrl: string;
  readonly branding: ChainBranding;
}

export interface NetworkEntry {
  readonly name: string;
  readonly label: string;
  readonly network: 'mainnet' | 'testnet' | 'devnet';
  readonly baseHostname: string;
  readonly explorerUrl: string;
}

// ── Per-chain branding definitions ──
// Real logos sourced from ~/work/{org}/logo/ repos.

/** Lux — downward-pointing triangle (~/work/lux/logo/) */
const LUX_BRANDING: ChainBranding = {
  brandName: 'Lux Network',
  logoViewBox: '0 0 100 100',
  logoContent: '<path d="M50 85 L15 25 L85 25 Z" fill="currentColor"/>',
  faviconContent: '<circle cx="256" cy="256" r="256"/><path fill="#fff" d="m256 410 179-308H77z"/>',
};

/** Zoo — three overlapping circles (~/work/zoo/logo/) */
const ZOO_BRANDING: ChainBranding = {
  brandName: 'Zoo Chain',
  logoViewBox: '0 0 64 64',
  logoContent:
    '<circle cx="32" cy="22" r="12" fill="#00A652"/>' +
    '<circle cx="21" cy="40" r="12" fill="#ED1C24"/>' +
    '<circle cx="43" cy="40" r="12" fill="#2E3192"/>',
  faviconContent:
    '<rect width="512" height="512" rx="64" fill="#000"/>' +
    '<circle cx="256" cy="176" r="96" fill="#00A652"/>' +
    '<circle cx="168" cy="320" r="96" fill="#ED1C24"/>' +
    '<circle cx="344" cy="320" r="96" fill="#2E3192"/>',
};

/** Hanzo — geometric H logo (~/work/hanzo/logo/) */
const HANZO_BRANDING: ChainBranding = {
  brandName: 'Hanzo AI',
  logoViewBox: '0 0 67 67',
  logoContent:
    '<path d="M22.21 67V44.64H0V67H22.21Z" fill="currentColor"/>' +
    '<path d="M66.7 22.32H22.25L0.09 44.64H44.46L66.7 22.32Z" fill="currentColor"/>' +
    '<path d="M22.21 0H0V22.32H22.21V0Z" fill="currentColor"/>' +
    '<path d="M66.72 0H44.51V22.32H66.72V0Z" fill="currentColor"/>' +
    '<path d="M66.72 67V44.64H44.51V67H66.72Z" fill="currentColor"/>',
  faviconContent:
    '<rect width="512" height="512" rx="64" fill="#000"/>' +
    '<g transform="translate(64,64) scale(5.73)">' +
    '<path d="M22.21 67V44.64H0V67H22.21Z" fill="#fff"/>' +
    '<path d="M66.7 22.32H22.25L0.09 44.64H44.46L66.7 22.32Z" fill="#fff"/>' +
    '<path d="M22.21 0H0V22.32H22.21V0Z" fill="#fff"/>' +
    '<path d="M66.72 0H44.51V22.32H66.72V0Z" fill="#fff"/>' +
    '<path d="M66.72 67V44.64H44.51V67H66.72Z" fill="#fff"/>' +
    '</g>',
};

/** SPC — unicorn */
const SPC_BRANDING: ChainBranding = {
  brandName: 'SPC Chain',
  logoViewBox: '0 0 64 64',
  logoContent:
    '<text x="32" y="46" text-anchor="middle" font-size="42" fill="currentColor">&#x1F984;</text>',
  faviconContent:
    '<rect width="512" height="512" rx="64" fill="#000"/>' +
    '<text x="256" y="350" text-anchor="middle" font-size="320">&#x1F984;</text>',
};

/** Pars — 8-pointed star with gold/blue gradients (~/work/pars/logo/) */

const PARS_STAR_OUTER = 'M0-100 30-60 100-40 60 0 100 40 30 60 0 100-30 60-100 40-60 0-100-40-30-60Z';

const PARS_STAR_INNER = 'M0-65 20-39 65-26 39 0 65 26 20 39 0 65-20 39-65 26-39 0-65-26-20-39Z';

const PARS_BRANDING: ChainBranding = {
  brandName: 'Pars Network',
  logoViewBox: '-120 -120 240 240',
  logoContent:
    `<path d="${ PARS_STAR_OUTER }" fill="none"` +
    ' stroke="currentColor" stroke-width="8"/>' +
    `<path d="${ PARS_STAR_INNER }" fill="currentColor"/>` +
    '<circle r="12" fill="currentColor"/>',
  faviconContent:
    '<rect width="512" height="512" rx="64" fill="#003355"/>' +
    '<g transform="translate(256,256) scale(2)">' +
    `<path d="${ PARS_STAR_OUTER }" fill="none"` +
    ' stroke="#f5d06f" stroke-width="8"/>' +
    `<path d="${ PARS_STAR_INNER }"` +
    ' fill="#00abff" stroke="#f5d06f" stroke-width="6"/>' +
    '<circle r="12" fill="#f5d06f"/></g>',
};

export const CHAINS: ReadonlyArray<ChainEntry> = [
  {
    name: 'C-Chain',
    label: 'Contract Chain',
    vm: 'EVM',
    network: 'mainnet',
    hostnames: [ 'explore.lux.network', 'localhost' ],
    explorerUrl: 'https://explore.lux.network',
    apiUrl: 'https://api-explore.lux.network',
    branding: LUX_BRANDING,
  },
  {
    name: 'Zoo',
    label: 'Zoo Chain',
    vm: 'Subnet EVM',
    network: 'mainnet',
    hostnames: [ 'explore-zoo.lux.network' ],
    explorerUrl: 'https://explore-zoo.lux.network',
    apiUrl: 'https://api-explore-zoo.lux.network',
    branding: ZOO_BRANDING,
  },
  {
    name: 'Hanzo',
    label: 'Hanzo AI',
    vm: 'Subnet EVM',
    network: 'mainnet',
    hostnames: [ 'explore-hanzo.lux.network' ],
    explorerUrl: 'https://explore-hanzo.lux.network',
    apiUrl: 'https://api-explore-hanzo.lux.network',
    branding: HANZO_BRANDING,
  },
  {
    name: 'SPC',
    label: 'SPC Chain',
    vm: 'Subnet EVM',
    network: 'mainnet',
    hostnames: [ 'explore-spc.lux.network' ],
    explorerUrl: 'https://explore-spc.lux.network',
    apiUrl: 'https://api-explore-spc.lux.network',
    branding: SPC_BRANDING,
  },
  {
    name: 'Pars',
    label: 'Pars Network',
    vm: 'Subnet EVM',
    network: 'mainnet',
    hostnames: [ 'explore-pars.lux.network' ],
    explorerUrl: 'https://explore-pars.lux.network',
    apiUrl: 'https://api-explore-pars.lux.network',
    branding: PARS_BRANDING,
  },
  // Testnet chains
  {
    name: 'C-Chain',
    label: 'Contract Chain',
    vm: 'EVM',
    network: 'testnet',
    hostnames: [ 'explore.lux-test.network' ],
    explorerUrl: 'https://explore.lux-test.network',
    apiUrl: 'https://api-explore.lux-test.network',
    branding: LUX_BRANDING,
  },
  // Devnet chains
  {
    name: 'C-Chain',
    label: 'Contract Chain',
    vm: 'EVM',
    network: 'devnet',
    hostnames: [ 'explore.lux-dev.network' ],
    explorerUrl: 'https://explore.lux-dev.network',
    apiUrl: 'https://api-explore.lux-dev.network',
    branding: LUX_BRANDING,
  },
];

export const NETWORKS: ReadonlyArray<NetworkEntry> = [
  {
    name: 'Mainnet',
    label: 'Production network',
    network: 'mainnet',
    baseHostname: 'explore.lux.network',
    explorerUrl: 'https://explore.lux.network',
  },
  {
    name: 'Testnet',
    label: 'Test network',
    network: 'testnet',
    baseHostname: 'explore.lux-test.network',
    explorerUrl: 'https://explore.lux-test.network',
  },
  {
    name: 'Devnet',
    label: 'Development network',
    network: 'devnet',
    baseHostname: 'explore.lux-dev.network',
    explorerUrl: 'https://explore.lux-dev.network',
  },
];

function getHostname(): string {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return 'explore.lux.network';
}

export function getCurrentChain(): ChainEntry {
  const hostname = getHostname();
  return CHAINS.find((c) => c.hostnames.includes(hostname)) ?? CHAINS[0];
}

export function getCurrentNetwork(): NetworkEntry {
  const chain = getCurrentChain();
  return NETWORKS.find((n) => n.network === chain.network) ?? NETWORKS[0];
}

export function getChainsForNetwork(network: 'mainnet' | 'testnet' | 'devnet'): ReadonlyArray<ChainEntry> {
  return CHAINS.filter((c) => c.network === network);
}
