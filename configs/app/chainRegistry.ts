// Multi-tenant chain registry. Maps hostnames to chain and network configuration.
// One Docker image serves all chains — the hostname determines the active chain.

export interface ChainEntry {
  readonly name: string;
  readonly label: string;
  readonly vm: string;
  readonly network: 'mainnet' | 'testnet' | 'devnet';
  readonly hostnames: ReadonlyArray<string>;
  readonly explorerUrl: string;
  readonly apiUrl: string;
}

export interface NetworkEntry {
  readonly name: string;
  readonly label: string;
  readonly network: 'mainnet' | 'testnet' | 'devnet';
  readonly baseHostname: string;
  readonly explorerUrl: string;
}

export const CHAINS: ReadonlyArray<ChainEntry> = [
  {
    name: 'C-Chain',
    label: 'Contract Chain',
    vm: 'EVM',
    network: 'mainnet',
    hostnames: [ 'explore.lux.network', 'localhost' ],
    explorerUrl: 'https://explore.lux.network',
    apiUrl: 'https://api-explore.lux.network',
  },
  {
    name: 'Zoo',
    label: 'Zoo Chain',
    vm: 'Subnet EVM',
    network: 'mainnet',
    hostnames: [ 'explore-zoo.lux.network' ],
    explorerUrl: 'https://explore-zoo.lux.network',
    apiUrl: 'https://api-explore-zoo.lux.network',
  },
  {
    name: 'Hanzo',
    label: 'Hanzo AI',
    vm: 'Subnet EVM',
    network: 'mainnet',
    hostnames: [ 'explore-hanzo.lux.network' ],
    explorerUrl: 'https://explore-hanzo.lux.network',
    apiUrl: 'https://api-explore-hanzo.lux.network',
  },
  {
    name: 'SPC',
    label: 'SPC Chain',
    vm: 'Subnet EVM',
    network: 'mainnet',
    hostnames: [ 'explore-spc.lux.network' ],
    explorerUrl: 'https://explore-spc.lux.network',
    apiUrl: 'https://api-explore-spc.lux.network',
  },
  {
    name: 'Pars',
    label: 'Pars Network',
    vm: 'Subnet EVM',
    network: 'mainnet',
    hostnames: [ 'explore-pars.lux.network' ],
    explorerUrl: 'https://explore-pars.lux.network',
    apiUrl: 'https://api-explore-pars.lux.network',
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
