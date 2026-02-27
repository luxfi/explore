// Multi-tenant chain registry. Maps hostnames to chain and network configuration.
// One Docker image serves all chains — the hostname determines the active chain.

export interface ChainBranding {

  /** Display name in the header (e.g. "Lux Network", "Zoo Chain") */
  readonly brandName: string;

  /** SVG path data for the 18×18 logo icon (viewBox "0 0 50 50") */
  readonly logoSvg: string;

  /** SVG path data for the favicon circle icon (viewBox "0 0 512 512") */
  readonly faviconSvg: string;
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

/** Lux triangle — downward-pointing triangle */
const LUX_BRANDING: ChainBranding = {
  brandName: 'Lux Network',
  logoSvg: 'M25 46.65 50 3.35H0z',
  faviconSvg: '<circle cx="256" cy="256" r="256"/><path fill="#fff" d="m256 410 179-308H77z"/>',
};

/** Zoo — hexagon (beehive / ecosystem) */
const ZOO_BRANDING: ChainBranding = {
  brandName: 'Zoo Chain',
  logoSvg: 'M25 3 46.65 14.5v21L25 47 3.35 35.5v-21z',
  faviconSvg: '<circle cx="256" cy="256" r="256"/><path fill="#fff" d="M256 82l150 87v174l-150 87-150-87V169z"/>',
};

/** Hanzo — four-pointed star */
const HANZO_BRANDING: ChainBranding = {
  brandName: 'Hanzo AI',
  logoSvg: 'M25 3 31 19h16l-13 10 5 16-14-10-14 10 5-16L3 19h16z',
  faviconSvg: '<circle cx="256" cy="256" r="256"/><path fill="#fff" d="M256 62l50 144h152l-123 90 47 144-126-91-126 91 47-144L54 206h152z"/>',
};

/** SPC — diamond / gem */
const SPC_BRANDING: ChainBranding = {
  brandName: 'SPC Chain',
  logoSvg: 'M25 3 47 25 25 47 3 25z',
  faviconSvg: '<circle cx="256" cy="256" r="256"/><path fill="#fff" d="M256 62l194 194-194 194L62 256z"/>',
};

/** Pars — octagram / eight-pointed star */
const PARS_BRANDING: ChainBranding = {
  brandName: 'Pars Network',
  logoSvg: 'M25 3l6 15h16l-13 9 5 16-14-10-14 10 5-16-13-9h16z',
  faviconSvg: '<circle cx="256" cy="256" r="256"/><path fill="#fff" d="M256 72l48 128h136l-110 80 42 130-116-84-116 84 42-130-110-80h136z"/>',
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
