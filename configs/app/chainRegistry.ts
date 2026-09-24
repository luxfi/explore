// Multi-tenant chain registry. Maps hostnames to chain and network configuration.
// One Docker image serves all chains — the hostname determines the active chain
// for the bundled brand defaults; every field is overridable at deploy time
// via NEXT_PUBLIC_BRAND_* env vars (see applyBrandEnvOverrides).

import { getEnvValue } from 'configs/app/utils';

export interface ChainBranding {

  /** Display name in the header (e.g. "Lux Network", "Zoo Chain") */
  readonly brandName: string;

  /** Sub-label rendered next to the logo (defaults to "Explorer") */
  readonly productName: string;

  /** Organization name for copyright (e.g. "Lux Industries Inc.") */
  readonly orgName: string;

  /** Primary website URL */
  readonly websiteUrl: string;

  /** One-line description for footer */
  readonly description: string;

  /** GitHub org URL */
  readonly githubUrl: string;

  /** Repository this frontend is built from, for the footer's version link.
   *  Every brand serves the same image from its own org's mirror, so the link
   *  has to follow the brand — a Lux URL on a Hanzo page is a cross-brand leak. */
  readonly sourceUrl: string;

  /** Twitter/X URL */
  readonly twitterUrl: string;

  /** Discord invite URL */
  readonly discordUrl: string;

  /** viewBox for the inline logo SVG */
  readonly logoViewBox: string;

  /** Inner SVG content for the inline logo (multi-path supported, uses currentColor) */
  readonly logoContent: string;

  /** Full inner SVG content for the favicon (viewBox "0 0 512 512") */
  readonly faviconContent: string;
}

/** Apply NEXT_PUBLIC_BRAND_* env overrides on top of bundled defaults.
 *  Operators can override any branding field at deploy time without
 *  rebuilding the image. Empty env values fall through to the default. */
export function applyBrandEnvOverrides(b: ChainBranding): ChainBranding {
  return {
    brandName: getEnvValue('NEXT_PUBLIC_BRAND_NAME') || b.brandName,
    productName: getEnvValue('NEXT_PUBLIC_BRAND_PRODUCT_NAME') || b.productName,
    orgName: getEnvValue('NEXT_PUBLIC_BRAND_ORG_NAME') || b.orgName,
    websiteUrl: getEnvValue('NEXT_PUBLIC_BRAND_WEBSITE_URL') || b.websiteUrl,
    description: getEnvValue('NEXT_PUBLIC_BRAND_DESCRIPTION') || b.description,
    githubUrl: getEnvValue('NEXT_PUBLIC_BRAND_GITHUB_URL') || b.githubUrl,
    sourceUrl: getEnvValue('NEXT_PUBLIC_BRAND_SOURCE_URL') || b.sourceUrl,
    twitterUrl: getEnvValue('NEXT_PUBLIC_BRAND_TWITTER_URL') || b.twitterUrl,
    discordUrl: getEnvValue('NEXT_PUBLIC_BRAND_DISCORD_URL') || b.discordUrl,
    logoViewBox: getEnvValue('NEXT_PUBLIC_BRAND_LOGO_VIEWBOX') || b.logoViewBox,
    logoContent: getEnvValue('NEXT_PUBLIC_BRAND_LOGO_CONTENT') || b.logoContent,
    faviconContent: getEnvValue('NEXT_PUBLIC_BRAND_FAVICON_CONTENT') || b.faviconContent,
  };
}

export interface ChainEntry {
  readonly name: string;
  readonly label: string;
  readonly vm: string;
  readonly network: 'mainnet' | 'testnet' | 'devnet' | 'localnet';

  /** EVM chain ID (uint64). Canonical values tracked in MEMORY.md. */
  readonly chainId: number;
  readonly hostnames: ReadonlyArray<string>;
  readonly explorerUrl: string;
  readonly apiUrl: string;

  /**
   * The P-Chain whose validators secure this chain. Lux reads its own; Zoo is
   * an L2 carried by Lux's validator set and reads Lux's, never its own node's.
   * Absent: no P-Chain secures the chain (Hanzo runs its own committee until
   * hanzod joins as an L2), and the explorer shows no P-Chain surface.
   */
  readonly pChain?: PChain;
  readonly branding: ChainBranding;
}

/** A P-Chain, read through GET <url>/v1/chain/P/ops/* (OpenAPI 3.1 at ops/.well-known/openapi.json). */
export interface PChain {

  /** API origin that serves it. */
  readonly url: string;

  /** Whose P-Chain it is, as a reader sees it named, e.g. "Lux primary network". */
  readonly name: string;

  /** Currency its stake is bonded in. */
  readonly symbol: string;
}

export interface NetworkEntry {
  readonly name: string;
  readonly label: string;
  readonly network: 'mainnet' | 'testnet' | 'devnet' | 'localnet';
  readonly baseHostname: string;
  readonly explorerUrl: string;
}

const LUX_MAINNET: PChain = { url: 'https://api.lux.network', name: 'Lux primary network', symbol: 'LUX' };
const LUX_TESTNET: PChain = { url: 'https://api.lux-test.network', name: 'Lux primary network', symbol: 'LUX' };

// ── Per-chain branding definitions ──
// Real logos sourced from ~/work/{org}/logo/ repos.

/** Lux — downward-pointing triangle (~/work/lux/logo/) */
const LUX_BRANDING: ChainBranding = {
  brandName: 'Lux Network',
  productName: 'Explorer',
  orgName: 'Lux Industries Inc.',
  websiteUrl: 'https://lux.network',
  description: 'High-performance blockchain for decentralized applications.',
  githubUrl: 'https://github.com/luxfi',
  sourceUrl: 'https://github.com/luxfi/explore',
  twitterUrl: 'https://x.com/luxdefi',
  discordUrl: 'https://discord.gg/luxnetwork',
  logoViewBox: '0 0 100 100',
  logoContent: '<path d="M50 85 L15 25 L85 25 Z" fill="currentColor"/>',
  faviconContent: '<circle cx="256" cy="256" r="256"/><path fill="#fff" d="m256 410 179-308H77z"/>',
};

/** Zoo — colorful interlocking circles from ~/work/zoo/logo/ */
const ZOO_BRANDING: ChainBranding = {
  brandName: 'Zoo Chain',
  productName: 'Explorer',
  orgName: 'Zoo Labs Foundation',
  websiteUrl: 'https://zoo.ngo',
  description: 'Open AI research network — decentralized AI and science.',
  githubUrl: 'https://github.com/zooai',
  sourceUrl: '',
  twitterUrl: 'https://x.com/zoo_labs',
  discordUrl: 'https://discord.gg/edmZPTZjH9',
  logoViewBox: '0 0 1024 1024',
  logoContent:
    '<defs>' +
    '<clipPath id="zooClip"><circle cx="512" cy="511" r="270"/></clipPath>' +
    '<clipPath id="zooGClip"><circle cx="513" cy="369" r="234"/></clipPath>' +
    '<clipPath id="zooRClip"><circle cx="365" cy="595" r="234"/></clipPath>' +
    '</defs>' +
    '<g clip-path="url(#zooClip)">' +
    '<circle cx="513" cy="369" r="234" fill="#00A652"/>' +
    '<circle cx="365" cy="595" r="234" fill="#ED1C24"/>' +
    '<circle cx="643" cy="595" r="234" fill="#2E3192"/>' +
    '<g clip-path="url(#zooGClip)">' +
    '<circle cx="365" cy="595" r="234" fill="#FCF006"/>' +
    '<circle cx="643" cy="595" r="234" fill="#01ACF1"/>' +
    '</g>' +
    '<g clip-path="url(#zooRClip)">' +
    '<circle cx="643" cy="595" r="234" fill="#EA018E"/>' +
    '</g>' +
    '<g clip-path="url(#zooGClip)">' +
    '<g clip-path="url(#zooRClip)">' +
    '<circle cx="643" cy="595" r="234" fill="#FFFFFF"/>' +
    '</g></g></g>',
  faviconContent:
    '<rect width="512" height="512" rx="64" fill="#000"/>' +
    '<g transform="translate(0,-5) scale(0.5)">' +
    '<defs>' +
    '<clipPath id="zfClip"><circle cx="512" cy="511" r="270"/></clipPath>' +
    '<clipPath id="zfG"><circle cx="513" cy="369" r="234"/></clipPath>' +
    '<clipPath id="zfR"><circle cx="365" cy="595" r="234"/></clipPath>' +
    '</defs>' +
    '<g clip-path="url(#zfClip)">' +
    '<circle cx="513" cy="369" r="234" fill="#00A652"/>' +
    '<circle cx="365" cy="595" r="234" fill="#ED1C24"/>' +
    '<circle cx="643" cy="595" r="234" fill="#2E3192"/>' +
    '<g clip-path="url(#zfG)">' +
    '<circle cx="365" cy="595" r="234" fill="#FCF006"/>' +
    '<circle cx="643" cy="595" r="234" fill="#01ACF1"/>' +
    '</g>' +
    '<g clip-path="url(#zfR)">' +
    '<circle cx="643" cy="595" r="234" fill="#EA018E"/>' +
    '</g>' +
    '<g clip-path="url(#zfG)">' +
    '<g clip-path="url(#zfR)">' +
    '<circle cx="643" cy="595" r="234" fill="#FFFFFF"/>' +
    '</g></g></g></g>',
};

/** Hanzo — geometric H logo (~/work/hanzo/logo/) */
const HANZO_BRANDING: ChainBranding = {
  brandName: 'Hanzo AI',
  productName: 'Explorer',
  orgName: 'Hanzo AI, Inc.',
  websiteUrl: 'https://hanzo.ai',
  description: 'AI blockchain — decentralized compute and inference.',
  githubUrl: 'https://github.com/hanzoai',
  sourceUrl: 'https://github.com/hanzoai/explore',
  twitterUrl: 'https://x.com/hanaboratory',
  discordUrl: 'https://discord.gg/hanzoai',
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

export const CHAINS: ReadonlyArray<ChainEntry> = [
  {
    name: 'C-Chain',
    label: 'Contract Chain',
    vm: 'EVM',
    network: 'mainnet',
    chainId: 96369,
    // explore.lux.build is a legacy alias — the runtime ingress 301-redirects
    // it to explore.lux.network, so we only register the canonical host here.
    hostnames: [ 'explore.lux.network', 'localhost', '127.0.0.1', '0.0.0.0' ],
    explorerUrl: 'https://explore.lux.network',
    apiUrl: 'https://api-explore.lux.network',
    pChain: LUX_MAINNET,
    branding: LUX_BRANDING,
  },
  {
    name: 'Zoo',
    label: 'Zoo Chain',
    vm: 'L2',
    network: 'mainnet',
    chainId: 200200,
    hostnames: [ 'explore-zoo.lux.network', 'explore.zoo.network', 'explorer.zoo.network', 'explore.zoo.ngo' ],
    explorerUrl: 'https://explore-zoo.lux.network',
    apiUrl: 'https://api-explore-zoo.lux.network',
    pChain: LUX_MAINNET,
    branding: ZOO_BRANDING,
  },
  {
    name: 'Hanzo',
    label: 'Hanzo AI',
    vm: 'L2',
    network: 'mainnet',
    chainId: 36963,
    hostnames: [ 'explore-hanzo.lux.network', 'explore.hanzo.network', 'explore.hanzo.ai' ],
    explorerUrl: 'https://explore-hanzo.lux.network',
    apiUrl: 'https://api-explore-hanzo.lux.network',
    branding: HANZO_BRANDING,
  },
  // Testnet chains
  {
    name: 'C-Chain',
    label: 'Contract Chain',
    vm: 'EVM',
    network: 'testnet',
    chainId: 96368,
    hostnames: [ 'explore-test.lux.network', 'explore.lux-test.network' ],
    explorerUrl: 'https://explore-test.lux.network',
    apiUrl: 'https://api-explore-test.lux.network',
    pChain: LUX_TESTNET,
    branding: LUX_BRANDING,
  },
  {
    name: 'Zoo',
    label: 'Zoo Chain (Testnet)',
    vm: 'L2',
    network: 'testnet',
    chainId: 200201,
    hostnames: [ 'explore-zoo-test.lux.network', 'explore.zoo-test.network' ],
    explorerUrl: 'https://explore-zoo-test.lux.network',
    apiUrl: 'https://api-explore-zoo-test.lux.network',
    pChain: LUX_TESTNET,
    branding: ZOO_BRANDING,
  },

  // Localnet — chainId 1337. Listing localhost / 127.0.0.1 / 0.0.0.0 here
  // keeps isWhiteLabelMode() false in local dev so the chain + network
  // selectors remain visible without env gymnastics.
  {
    name: 'C-Chain',
    label: 'Contract Chain',
    vm: 'EVM',
    network: 'localnet',
    chainId: 1337,
    hostnames: [ 'explore.localnet', 'explore-local.lux.network' ],
    explorerUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:4000',
    pChain: { url: 'http://localhost:9630', name: 'Lux primary network', symbol: 'LUX' },
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
    name: 'Localnet',
    label: 'Local development (chainId 1337)',
    network: 'localnet',
    baseHostname: 'localhost',
    explorerUrl: 'http://localhost:3000',
  },
];

// ── White-label support ──
// When the hostname doesn't match any known chain, build branding from env vars.
// This allows a single Docker image to serve any EVM chain.

function buildWhiteLabelBranding(): ChainBranding {
  return {
    brandName: getEnvValue('NEXT_PUBLIC_NETWORK_NAME') || 'Explorer',
    productName: getEnvValue('NEXT_PUBLIC_BRAND_PRODUCT_NAME') || 'Explorer',
    orgName: getEnvValue('NEXT_PUBLIC_NETWORK_ORG_NAME') || '',
    websiteUrl: getEnvValue('NEXT_PUBLIC_NETWORK_WEBSITE_URL') || '',
    description: getEnvValue('NEXT_PUBLIC_NETWORK_DESCRIPTION') || 'Blockchain explorer.',
    githubUrl: getEnvValue('NEXT_PUBLIC_NETWORK_GITHUB_URL') || '',
    sourceUrl: '',
    twitterUrl: getEnvValue('NEXT_PUBLIC_NETWORK_TWITTER_URL') || '',
    discordUrl: getEnvValue('NEXT_PUBLIC_NETWORK_DISCORD_URL') || '',
    logoViewBox: '0 0 100 100',
    logoContent: '<circle cx="50" cy="50" r="40" fill="currentColor"/>',
    faviconContent: '<circle cx="256" cy="256" r="256"/>',
  };
}

// An unregistered host reads the P-Chain of the node its RPC URL names.
function buildWhiteLabelPChain(brandName: string): PChain | undefined {
  try {
    return {
      url: new URL(getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL') ?? '').origin,
      name: brandName,
      symbol: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL') || '',
    };
  } catch {
    return undefined;
  }
}

function buildWhiteLabelChain(hostname: string): ChainEntry {
  const branding = buildWhiteLabelBranding();
  const appHost = getEnvValue('NEXT_PUBLIC_APP_HOST') || hostname;
  const apiHost = getEnvValue('NEXT_PUBLIC_API_HOST') || '';
  const protocol = getEnvValue('NEXT_PUBLIC_APP_PROTOCOL') || 'https';
  const apiProtocol = getEnvValue('NEXT_PUBLIC_API_PROTOCOL') || 'https';
  return {
    name: getEnvValue('NEXT_PUBLIC_NETWORK_SHORT_NAME') || branding.brandName,
    label: branding.brandName,
    vm: 'EVM',
    network: (getEnvValue('NEXT_PUBLIC_IS_TESTNET') === 'true' ? 'testnet' : 'mainnet') as 'mainnet' | 'testnet' | 'devnet' | 'localnet',
    chainId: Number(getEnvValue('NEXT_PUBLIC_NETWORK_ID')) || 0,
    hostnames: [ hostname ],
    explorerUrl: `${ protocol }://${ appHost }`,
    apiUrl: apiHost ? `${ apiProtocol }://${ apiHost }` : '',
    pChain: buildWhiteLabelPChain(branding.brandName),
    branding,
  };
}

function getHostname(): string {
  // Client: trust the browser — this is the request origin.
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  // Server: prefer the per-request Host header captured in AsyncLocalStorage
  // at the start of each SSR render (see pages/_document.tsx). This keeps the
  // FE stateless — one docker image serves any hostname. Fall back to the
  // build-time env only when called outside a request (static prerender,
  // health checks, etc.).
  try {
    // Lazy require so browser bundles don't pick up the ALS module.

    const { getRequestHost } = require('lib/requestHost') as { getRequestHost: () => string };
    const reqHost = getRequestHost();
    if (reqHost) return reqHost;
  } catch { /* Falls through to env fallback. */ }
  return getEnvValue('NEXT_PUBLIC_APP_HOST') || 'explore.lux.network';
}

export function isWhiteLabelMode(): boolean {
  const hostname = getHostname();
  return !CHAINS.some((c) => c.hostnames.includes(hostname));
}

export function isChainSelectorEnabled(): boolean {
  const envVal = getEnvValue('NEXT_PUBLIC_CHAIN_SELECTOR_ENABLED');
  if (envVal !== undefined && envVal !== '') {
    return envVal === 'true';
  }
  // Disabled by default in white-label mode
  return !isWhiteLabelMode();
}

export function isNetworkSelectorEnabled(): boolean {
  const envVal = getEnvValue('NEXT_PUBLIC_NETWORK_SELECTOR_ENABLED');
  if (envVal !== undefined && envVal !== '') {
    return envVal === 'true';
  }
  // Disabled by default in white-label mode
  return !isWhiteLabelMode();
}

function getChain(hostname: string): ChainEntry {
  return CHAINS.find((c) => c.hostnames.includes(hostname)) ?? buildWhiteLabelChain(hostname);
}

export function getCurrentChain(): ChainEntry {
  const base = getChain(getHostname());
  // Apply NEXT_PUBLIC_BRAND_* env overrides on every read so deploys can
  // rebrand without rebuilding the bundle.
  return { ...base, branding: applyBrandEnvOverrides(base.branding) };
}

/**
 * True only on the Lux PRIMARY-network explorer (the Lux C-Chain host +
 * the unregistered white-label fallback, both `vm: 'EVM'`). Brand explorers
 * (Hanzo / Zoo are `vm: 'L2'`) return false: they show ONLY
 * their own chain, never the Lux primary-network chains / cross-L1 lists.
 */
export function isPrimaryNetworkExplorer(): boolean {
  // The Lux primary-network explorer is the REGISTERED Lux C-Chain host only.
  // White-label / unregistered hosts are sovereign brand explorers: they
  // show ONLY their own chain — never the Lux
  // primary network's chains or the cross-L1 list. Gating purely on vm==='EVM'
  // wrongly promoted unregistered hosts (buildWhiteLabelChain defaults to
  // vm:'EVM') to primary, leaking the parent network's chains.
  return isPrimaryNetworkHost(getHostname());
}

/** isPrimaryNetworkExplorer() for an explicit host, e.g. a request's Host header. */
export function isPrimaryNetworkHost(hostname: string): boolean {
  const chain = CHAINS.find((c) => c.hostnames.includes(hostname));
  return chain !== undefined && chain.vm === 'EVM';
}

/** The P-Chain that secures the chain served at `hostname` (ChainEntry.pChain); by default this request's host. */
export function getPChain(hostname: string = getHostname()): PChain | undefined {
  return getChain(hostname).pChain;
}

export function getCurrentNetwork(): NetworkEntry {
  const chain = getCurrentChain();
  if (isWhiteLabelMode()) {
    // In white-label mode, return a single network entry from env vars
    const branding = buildWhiteLabelBranding();
    const appHost = getEnvValue('NEXT_PUBLIC_APP_HOST') || '';
    const protocol = getEnvValue('NEXT_PUBLIC_APP_PROTOCOL') || 'https';
    return {
      name: chain.network === 'testnet' ? 'Testnet' : 'Mainnet',
      label: branding.brandName,
      network: chain.network,
      baseHostname: appHost,
      explorerUrl: appHost ? `${ protocol }://${ appHost }` : '',
    };
  }
  return NETWORKS.find((n) => n.network === chain.network) ?? NETWORKS[0];
}

export function getChainsForNetwork(network: 'mainnet' | 'testnet' | 'devnet' | 'localnet'): ReadonlyArray<ChainEntry> {
  return CHAINS.filter((c) => c.network === network);
}
