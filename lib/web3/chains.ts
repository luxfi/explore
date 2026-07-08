import type { Chain } from 'viem';

import appConfig from 'configs/app';
import { CHAINS as REGISTRY_CHAINS, getCurrentChain } from 'configs/app/chainRegistry';
import essentialDappsChainsConfig from 'configs/essential-dapps-chains';
import multichainConfig from 'configs/multichain';

const getChainInfo = (
  config: Partial<typeof appConfig> = appConfig,
  contracts?: Chain['contracts'],
  logoUrl?: string,
): Chain | undefined => {
  if (!config.chain || !config.app) {
    return;
  }

  return {
    id: Number(config.chain.id),
    name: config.chain.name ?? '',
    nativeCurrency: {
      decimals: config.chain.currency.decimals,
      name: config.chain.currency.name ?? '',
      symbol: config.chain.currency.symbol ?? '',
    },
    rpcUrls: {
      'default': {
        http: config.chain.rpcUrls,
      },
    },
    blockExplorers: {
      'default': {
        name: `${ config.chain.name || '' } Explorer`.trim(),
        url: config.app.baseUrl,
      },
    },
    testnet: config.chain.isTestnet,
    contracts,
    custom: {
      logoUrl: logoUrl ?? config.UI?.navigation.icon.default,
    },
  };
};

export const currentChain: Chain | undefined = !appConfig.features.multichain.isEnabled ? getChainInfo() : undefined;

export const parentChain: Chain | undefined = (() => {
  const rollupFeature = appConfig.features.rollup;

  const parentChain = rollupFeature.isEnabled && rollupFeature.parentChain;

  if (!parentChain) {
    return;
  }

  if (!parentChain.id || !parentChain.name || !parentChain.rpcUrls || !parentChain.baseUrl || !parentChain.currency) {
    return;
  }

  return {
    id: parentChain.id,
    name: parentChain.name,
    nativeCurrency: parentChain.currency,
    rpcUrls: {
      'default': {
        http: parentChain.rpcUrls,
      },
    },
    blockExplorers: {
      'default': {
        name: `${ parentChain.name || '' } Explorer`.trim(),
        url: parentChain.baseUrl,
      },
    },
    testnet: parentChain.isTestnet,
  };
})();

export const clusterChains: Array<Chain> | undefined = (() => {
  const config = multichainConfig();

  if (!config) {
    return;
  }

  return config.chains.map(({ app_config: config, logo }) => getChainInfo(config, undefined, logo)).filter(Boolean);
})();

export const essentialDappsChains: Array<Chain> | undefined = (() => {
  const config = essentialDappsChainsConfig();

  if (!config) {
    return;
  }

  return config.chains.map(({ app_config: config, contracts, logo }) => getChainInfo(config, contracts, logo)).filter(Boolean);
})();

// Sibling networks of the current brand, sourced from the multi-tenant chain
// registry so the wallet-connect flow presents / can add EVERY registered
// network for this brand — e.g. Lux mainnet (96369), testnet (96368) and
// devnet (96370) — instead of only the single env-configured chain. This is
// the "native all-chains" connect: the list is derived from the registry
// (the same source of truth as the header chain switcher), never hardcoded to
// one chain. Each sibling's read RPC is its brand explorer's Blockscout
// eth-rpc proxy (mirrors the read-only transport wagmiConfig builds for the
// primary chain); the current chain keeps its own direct RPC from env.
export const brandFamilyChains: Array<Chain> = (() => {
  if (!currentChain) {
    return [];
  }
  const current = getCurrentChain();
  const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return REGISTRY_CHAINS
    .filter((c) => c.branding.brandName === current.branding.brandName && c.chainId !== currentChain.id)
    .map((c): Chain => ({
      id: c.chainId,
      name: c.network === 'mainnet' ? current.branding.brandName : `${ current.branding.brandName } ${ titleCase(c.network) }`,
      nativeCurrency: currentChain.nativeCurrency,
      rpcUrls: {
        'default': { http: [ `${ c.apiUrl }/api/eth-rpc` ] },
      },
      blockExplorers: {
        'default': { name: `${ current.branding.brandName } Explorer`, url: c.explorerUrl },
      },
      testnet: c.network !== 'mainnet',
    }));
})();

export const chains = (() => {
  const dedupeById = (list: Array<Chain | undefined>): Array<Chain> =>
    list.filter(Boolean).filter((chain, index, arr) => arr.findIndex((c) => c?.id === chain?.id) === index) as Array<Chain>;

  if (essentialDappsChains) {
    const hasCurrentChain = essentialDappsChains.some((chain) => chain.id === currentChain?.id);
    const hasParentChain = essentialDappsChains.some((chain) => chain.id === parentChain?.id);

    return dedupeById([
      ...essentialDappsChains,
      hasCurrentChain ? undefined : currentChain,
      hasParentChain ? undefined : parentChain,
      ...brandFamilyChains,
    ]);
  }

  return dedupeById([ currentChain, ...brandFamilyChains, parentChain, ...(clusterChains ?? []) ]);
})();
