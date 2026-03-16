// Multi-tenant chain registry. Maps hostnames to chain and network configuration.
// One Docker image serves all chains — the hostname determines the active chain.

export interface ChainBranding {

  /** Display name in the header (e.g. "Lux Network", "Zoo Chain") */
  readonly brandName: string;

  /** Organization name for copyright (e.g. "Lux Industries Inc.") */
  readonly orgName: string;

  /** Primary website URL */
  readonly websiteUrl: string;

  /** One-line description for footer */
  readonly description: string;

  /** GitHub org URL */
  readonly githubUrl: string;

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
  orgName: 'Lux Industries Inc.',
  websiteUrl: 'https://lux.network',
  description: 'High-performance blockchain for decentralized applications.',
  githubUrl: 'https://github.com/luxfi',
  twitterUrl: 'https://x.com/luxdefi',
  discordUrl: 'https://discord.gg/luxnetwork',
  logoViewBox: '0 0 100 100',
  logoContent: '<path d="M50 85 L15 25 L85 25 Z" fill="currentColor"/>',
  faviconContent: '<circle cx="256" cy="256" r="256"/><path fill="#fff" d="m256 410 179-308H77z"/>',
};

/** Zoo — interlocking rings (~/work/zoo/logo/) */
const ZOO_BRANDING: ChainBranding = {
  brandName: 'Zoo Chain',
  orgName: 'Zoo Labs Foundation',
  websiteUrl: 'https://zoo.ngo',
  description: 'Open AI research network — decentralized AI and science.',
  githubUrl: 'https://github.com/zoolabs',
  twitterUrl: 'https://x.com/zoolabs',
  discordUrl: 'https://discord.gg/zoolabs',
  logoViewBox: '0 0 1024 1024',
  logoContent:
    '<defs><clipPath id="zooClip"><circle cx="508" cy="510" r="283"/></clipPath></defs>' +
    '<g clip-path="url(#zooClip)">' +
    '<circle cx="513" cy="369" r="234" fill="none" stroke="currentColor" stroke-width="33"/>' +
    '<circle cx="365" cy="595" r="234" fill="none" stroke="currentColor" stroke-width="33"/>' +
    '<circle cx="643" cy="595" r="234" fill="none" stroke="currentColor" stroke-width="33"/>' +
    '<circle cx="508" cy="510" r="265" fill="none" stroke="currentColor" stroke-width="36"/>' +
    '</g>',
  faviconContent:
    '<rect width="512" height="512" rx="64" fill="#000"/>' +
    '<g transform="translate(0,-10) scale(0.5)">' +
    '<defs><clipPath id="zooFavClip"><circle cx="508" cy="510" r="283"/></clipPath></defs>' +
    '<g clip-path="url(#zooFavClip)">' +
    '<circle cx="513" cy="369" r="234" fill="none" stroke="#fff" stroke-width="33"/>' +
    '<circle cx="365" cy="595" r="234" fill="none" stroke="#fff" stroke-width="33"/>' +
    '<circle cx="643" cy="595" r="234" fill="none" stroke="#fff" stroke-width="33"/>' +
    '<circle cx="508" cy="510" r="265" fill="none" stroke="#fff" stroke-width="36"/>' +
    '</g></g>',
};

/** Hanzo — geometric H logo (~/work/hanzo/logo/) */
const HANZO_BRANDING: ChainBranding = {
  brandName: 'Hanzo AI',
  orgName: 'Hanzo Industries Inc.',
  websiteUrl: 'https://hanzo.ai',
  description: 'AI blockchain — decentralized compute and inference.',
  githubUrl: 'https://github.com/hanzoai',
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

/** SPC — unicorn */
const SPC_BRANDING: ChainBranding = {
  brandName: 'SPC Chain',
  orgName: 'Sparkle Pony Club',
  websiteUrl: 'https://sparkleponyclub.com',
  description: 'SPC chain on Lux Network.',
  githubUrl: 'https://github.com/luxfi',
  twitterUrl: 'https://x.com/luxdefi',
  discordUrl: 'https://discord.gg/luxnetwork',
  logoViewBox: '0 0 64 64',
  logoContent:
    '<text x="32" y="46" text-anchor="middle" font-size="42" fill="currentColor">&#x1F984;</text>',
  faviconContent:
    '<rect width="512" height="512" rx="64" fill="#000"/>' +
    '<text x="256" y="350" text-anchor="middle" font-size="320">&#x1F984;</text>',
};

/** Pars — Persian 8-pointed star from ~/work/pars/logo/docs/assets/pars-logo-mono.svg */
const PARS_BRANDING: ChainBranding = {
  brandName: 'Pars Network',
  orgName: 'Parsis Foundation',
  websiteUrl: 'https://pars.network',
  description: 'Pars blockchain — financial infrastructure for the Persian-speaking world.',
  githubUrl: 'https://github.com/luxfi',
  twitterUrl: 'https://x.com/parsnetwork',
  discordUrl: 'https://discord.gg/luxnetwork',
  logoViewBox: '-120 -120 240 240',
  logoContent:
    // Outer 8-pointed star
    '<path d="M0,-100 L30,-60 L100,-40 L60,0 L100,40 L30,60 L0,100 L-30,60 L-100,40 L-60,0 L-100,-40 L-30,-60 Z"' +
    ' fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>' +
    // Inner star
    '<path d="M0,-70 L22,-42 L70,-28 L42,0 L70,28 L22,42 L0,70 L-22,42 L-70,28 L-42,0 L-70,-28 L-22,-42 Z"' +
    ' fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' +
    // Recursive inner star
    '<path d="M0,-45 L14,-27 L45,-18 L27,0 L45,18 L14,27 L0,45 L-14,27 L-45,18 L-27,0 L-45,-18 L-14,-27 Z"' +
    ' fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="0.6"/>' +
    // Interlaced circles
    '<circle r="55" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>' +
    '<circle r="35" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>' +
    // Center rosette
    '<circle r="8" fill="currentColor"/>' +
    '<path d="M0,-20 L6,-6 L20,0 L6,6 L0,20 L-6,6 L-20,0 L-6,-6 Z"' +
    ' fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" opacity="0.8"/>',
  faviconContent:
    '<rect width="512" height="512" rx="64" fill="#000"/>' +
    '<g transform="translate(256,256) scale(2)">' +
    '<path d="M0,-100 L30,-60 L100,-40 L60,0 L100,40 L30,60 L0,100 L-30,60 L-100,40 L-60,0 L-100,-40 L-30,-60 Z"' +
    ' fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M0,-70 L22,-42 L70,-28 L42,0 L70,28 L22,42 L0,70 L-22,42 L-70,28 L-42,0 L-70,-28 L-22,-42 Z"' +
    ' fill="#fff" fill-opacity="0.15" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M0,-45 L14,-27 L45,-18 L27,0 L45,18 L14,27 L0,45 L-14,27 L-45,18 L-27,0 L-45,-18 L-14,-27 Z"' +
    ' fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" opacity="0.6"/>' +
    '<circle r="55" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.4"/>' +
    '<circle r="35" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.4"/>' +
    '<circle r="8" fill="#fff"/>' +
    '<path d="M0,-20 L6,-6 L20,0 L6,6 L0,20 L-6,6 L-20,0 L-6,-6 Z"' +
    ' fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" opacity="0.8"/>' +
    '</g>',
};

export const CHAINS: ReadonlyArray<ChainEntry> = [
  {
    name: 'C-Chain',
    label: 'Contract Chain',
    vm: 'EVM',
    network: 'mainnet',
    hostnames: [ 'explore.lux.network', 'explore.lux.build', 'localhost' ],
    explorerUrl: 'https://explore.lux.network',
    apiUrl: 'https://api-explore.lux.network',
    branding: LUX_BRANDING,
  },
  {
    name: 'Zoo',
    label: 'Zoo Chain',
    vm: 'L2',
    network: 'mainnet',
    hostnames: [ 'explore-zoo.lux.network', 'explore.zoo.network', 'explore.zoo.ngo' ],
    explorerUrl: 'https://explore-zoo.lux.network',
    apiUrl: 'https://api-explore-zoo.lux.network',
    branding: ZOO_BRANDING,
  },
  {
    name: 'Hanzo',
    label: 'Hanzo AI',
    vm: 'L2',
    network: 'mainnet',
    hostnames: [ 'explore-hanzo.lux.network', 'explore.hanzo.network', 'explore.hanzo.ai' ],
    explorerUrl: 'https://explore-hanzo.lux.network',
    apiUrl: 'https://api-explore-hanzo.lux.network',
    branding: HANZO_BRANDING,
  },
  {
    name: 'SPC',
    label: 'SPC Chain',
    vm: 'L2',
    network: 'mainnet',
    hostnames: [ 'explore-spc.lux.network' ],
    explorerUrl: 'https://explore-spc.lux.network',
    apiUrl: 'https://api-explore-spc.lux.network',
    branding: SPC_BRANDING,
  },
  {
    name: 'Pars',
    label: 'Pars Network',
    vm: 'L2',
    network: 'mainnet',
    hostnames: [ 'explore-pars.lux.network', 'explore.pars.network' ],
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
    hostnames: [ 'explore-test.lux.network', 'explore.lux-test.network' ],
    explorerUrl: 'https://explore-test.lux.network',
    apiUrl: 'https://api-explore-test.lux.network',
    branding: LUX_BRANDING,
  },
  // Devnet chains
  {
    name: 'C-Chain',
    label: 'Contract Chain',
    vm: 'EVM',
    network: 'devnet',
    hostnames: [ 'explore-dev.lux.network', 'explore.lux-dev.network' ],
    explorerUrl: 'https://explore-dev.lux.network',
    apiUrl: 'https://api-explore-dev.lux.network',
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

import { getEnvValue } from 'configs/app/utils';

function getHostname(): string {
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  return getEnvValue('NEXT_PUBLIC_APP_HOST') || 'explore.lux.network';
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
