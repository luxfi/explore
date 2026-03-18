import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import { useBlockchains, useCurrentValidators, useSubnets } from 'lib/api/pchain';
import type { PChainBlockchain, PChainValidator } from 'lib/api/pchain';
import { cn } from 'lib/utils/cn';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import PageTitle from 'ui/shared/Page/PageTitle';

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const LUX_DECIMALS = 6;

const PRIMARY_CHAIN_META: Readonly<Record<string, {
  readonly name: string;
  readonly fullName: string;
  readonly vm: string;
  readonly vmId: string;
  readonly description: string;
}>> = {
  'c-chain': {
    name: 'C-Chain',
    fullName: 'Contract Chain',
    vm: 'EVM',
    vmId: 'mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6',
    description: 'The C-Chain is an EVM-compatible blockchain on the network used for smart contracts and DeFi applications.',
  },
  'p-chain': {
    name: 'P-Chain',
    fullName: 'Platform Chain',
    vm: 'PVM',
    vmId: 'rWhpuQPF1kb72esV2momhMuTYGkEb1oL29pt2EBXWsBY6MALT',
    description: 'The P-Chain manages validators, staking, and subnet creation across the network.',
  },
  'x-chain': {
    name: 'X-Chain',
    fullName: 'Exchange Chain',
    vm: 'AVM',
    vmId: 'jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq',
    description: 'The X-Chain is a DAG-based chain for creating and exchanging digital assets on the network.',
  },
  'd-chain': {
    name: 'D-Chain',
    fullName: 'DEX Chain',
    vm: 'DexVM',
    vmId: '',
    description: 'The D-Chain is a decentralized exchange chain on the network for on-chain order books and token swaps.',
  },
  'a-chain': {
    name: 'A-Chain',
    fullName: 'AI Chain',
    vm: 'AIVM',
    vmId: '',
    description: 'The A-Chain powers AI workloads on the network, providing decentralized inference and model serving.',
  },
  'b-chain': {
    name: 'B-Chain',
    fullName: 'Bridge Chain',
    vm: 'BridgeVM',
    vmId: '',
    description: 'The B-Chain is the bridge relay chain on the network, enabling cross-chain asset transfers via Teleporter.',
  },
  'q-chain': {
    name: 'Q-Chain',
    fullName: 'Quantum Chain',
    vm: 'QuantumVM',
    vmId: '',
    description: 'The Q-Chain provides post-quantum cryptographic primitives and quantum-resistant operations on the network.',
  },
  't-chain': {
    name: 'T-Chain',
    fullName: 'Threshold Chain',
    vm: 'ThresholdVM',
    vmId: '',
    description: 'The T-Chain enables threshold signature schemes and distributed key generation on the network.',
  },
  'z-chain': {
    name: 'Z-Chain',
    fullName: 'ZK Chain',
    vm: 'ZKVM',
    vmId: '',
    description: 'The Z-Chain handles zero-knowledge proof generation and verification on the network.',
  },
  'g-chain': {
    name: 'G-Chain',
    fullName: 'Graph Chain',
    vm: 'GraphVM',
    vmId: '',
    description: 'The G-Chain provides decentralized graph indexing and query services on the network.',
  },
  'k-chain': {
    name: 'K-Chain',
    fullName: 'Key Chain',
    vm: 'KeyVM',
    vmId: '',
    description: 'The K-Chain provides decentralized key management and custody services on the network.',
  },
  'o-chain': {
    name: 'O-Chain',
    fullName: 'Oracle Chain',
    vm: 'OracleVM',
    vmId: '',
    description: 'The O-Chain provides decentralized oracle services, bringing off-chain data on-chain for the network.',
  },
  'r-chain': {
    name: 'R-Chain',
    fullName: 'Relay Chain',
    vm: 'RelayVM',
    vmId: '',
    description: 'The R-Chain handles cross-chain message relay and interoperability routing on the network.',
  },
  'i-chain': {
    name: 'I-Chain',
    fullName: 'Identity Chain',
    vm: 'IdentityVM',
    vmId: '',
    description: 'The I-Chain manages decentralized identity, DIDs, and verifiable credentials on the network.',
  },
};

const SUBNET_CHAIN_IDS: Readonly<Record<string, number>> = {
  zoo: 200200,
  hanzo: 36963,
  spc: 36911,
  pars: 494949,
};

const SUBNET_DESCRIPTIONS: Readonly<Record<string, string>> = {
  zoo: 'Zoo is an L1 blockchain on the network for the Zoo Labs Foundation open AI research network.',
  hanzo: 'Hanzo is an L1 blockchain on the network for Hanzo AI infrastructure and agent frameworks.',
  spc: 'SPC is an L1 blockchain on the network.',
  pars: 'Pars is an L1 blockchain on the network.',
};

const EXPLORER_URLS: Readonly<Record<string, string>> = {
  zoo: 'https://explore-zoo.lux.network',
  hanzo: 'https://explore-hanzo.lux.network',
  spc: 'https://explore-spc.lux.network',
  pars: 'https://explore-pars.lux.network',
};

const KNOWN_VM_IDS: Readonly<Record<string, string>> = {
  mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6: 'EVM',
  ag3GReYPNuSR17rUP8acMdZipQBikdXNRKDyFszAysmy3vDXE: 'L2',
  jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq: 'AVM',
  rWhpuQPF1kb72esV2momhMuTYGkEb1oL29pt2EBXWsBY6MALT: 'PVM',
};

// DAG chain indexer API URLs
const CHAIN_INDEXER_URLS: Readonly<Record<string, string>> = {
  'x-chain': 'https://api-indexer-xchain.lux.network',
  'a-chain': 'https://api-indexer-achain.lux.network',
  'b-chain': 'https://api-indexer-bchain.lux.network',
  'q-chain': 'https://api-indexer-qchain.lux.network',
  't-chain': 'https://api-indexer-tchain.lux.network',
  'z-chain': 'https://api-indexer-zchain.lux.network',
  'k-chain': 'https://api-indexer-kchain.lux.network',
  'p-chain': 'https://api-indexer-pchain.lux.network',
  'c-chain': 'https://api-indexer.lux.network',
};

interface IndexerStats {
  readonly chain_stats: Record<string, unknown>;
  readonly dag_stats?: {
    readonly total_vertices: number;
    readonly total_edges: number;
    readonly accepted_vertices: number;
    readonly pending_vertices: number;
    readonly chain_type: string;
    readonly last_updated: string;
  };
}

function useChainIndexerStats(slug: string): { stats: IndexerStats | null; isLoading: boolean } {
  const indexerUrl = CHAIN_INDEXER_URLS[slug];
  const query = useQuery({
    queryKey: [ 'chainIndexerStats', slug ],
    queryFn: async() => {
      if (!indexerUrl) return null;
      const res = await fetch(`${ indexerUrl }/api/v2/stats`);
      if (!res.ok) return null;
      return await res.json() as IndexerStats;
    },
    staleTime: 30_000,
    enabled: Boolean(indexerUrl),
  });
  return { stats: query.data ?? null, isLoading: query.isLoading };
}

function formatStake(nanoLux: bigint): string {
  const lux = Number(nanoLux) / Math.pow(10, LUX_DECIMALS);
  if (lux >= 1_000_000) return `${ (lux / 1_000_000).toFixed(2) }M`;
  if (lux >= 1_000) return `${ (lux / 1_000).toFixed(2) }K`;
  return lux.toFixed(2);
}

function truncateId(id: string, len: number = 16): string {
  if (id.length <= len) return id;
  return `${ id.slice(0, 8) }...${ id.slice(-6) }`;
}

interface InfoRowProps {
  readonly label: string;
  readonly value: string;
  readonly isMono?: boolean;
  readonly canCopy?: boolean;
}

const InfoRow = ({ label, value, isMono = false, canCopy = false }: InfoRowProps) => (
  <div className="flex py-3 px-4 border-b border-[var(--color-border-divider)] odd:bg-[var(--color-gray-50)] dark:odd:bg-[var(--color-whiteAlpha-50)] gap-4 flex-wrap lg:flex-nowrap">
    <div className="min-w-full lg:min-w-[200px] shrink-0 text-[var(--color-text-secondary)] text-sm font-medium">
      { label }
    </div>
    <div className="flex-1 flex items-center gap-1 min-w-0">
      <span className={ cn('text-sm text-[var(--color-text-primary)] break-all', isMono && 'font-mono') }>
        { value }
      </span>
      { canCopy && <CopyToClipboard text={ value }/> }
    </div>
  </div>
);

interface ValidatorRowProps {
  readonly validator: PChainValidator;
  readonly index: number;
}

const ValidatorRow = ({ validator, index }: ValidatorRowProps) => {
  const stake = BigInt(validator.stakeAmount || validator.weight || '0');
  const uptime = parseFloat(validator.uptime || '0') * 100;

  return (
    <div className="flex py-3 px-4 border-b border-[var(--color-border-divider)] hover:bg-[var(--color-gray-50)] dark:hover:bg-[var(--color-whiteAlpha-50)] transition-colors duration-150 gap-4 items-center flex-wrap lg:flex-nowrap">
      <div className="w-10 shrink-0 text-[var(--color-text-secondary)] text-sm">
        { index + 1 }
      </div>
      <div className="flex-[2] min-w-0">
        <span className="text-sm font-mono text-[var(--color-text-primary)]" title={ validator.nodeID }>
          { truncateId(validator.nodeID, 24) }
        </span>
      </div>
      <div className="flex-1 text-right">
        <span className="text-sm text-[var(--color-text-primary)] font-medium">
          { formatStake(stake) } { config.chain.currency.symbol || 'LUX' }
        </span>
      </div>
      <div className="w-20 text-right shrink-0">
        <span className="text-sm text-[var(--color-text-primary)]">
          { uptime.toFixed(1) }%
        </span>
      </div>
      <div className="w-10 shrink-0 text-center">
        <div className={ cn('w-2 h-2 rounded-full inline-block', validator.connected ? 'bg-green-400' : 'bg-gray-400') }/>
      </div>
    </div>
  );
};

const ChainDetailPage = () => {
  const router = useRouter();
  const slug = (router.query.slug as string || '').toLowerCase();

  const { blockchains, isLoading: chainsLoading } = useBlockchains();
  const { validators, isLoading: validatorsLoading } = useCurrentValidators();
  const { subnets } = useSubnets();
  const { stats: indexerStats } = useChainIndexerStats(slug);

  const resolvedChain = React.useMemo<{
    blockchain: PChainBlockchain | undefined;
    isPrimary: boolean;
    meta: typeof PRIMARY_CHAIN_META[string] | undefined;
  }>(() => {
    // Check primary chains first
    const primaryMeta = PRIMARY_CHAIN_META[slug];
    if (primaryMeta) {
      return { blockchain: undefined, isPrimary: true, meta: primaryMeta };
    }

    // Check L1 chains
    const chain = blockchains.find((c) =>
      c.name.toLowerCase() === slug ||
      c.id.toLowerCase() === slug,
    );
    return { blockchain: chain, isPrimary: false, meta: undefined };
  }, [ slug, blockchains ]);

  const chainName = resolvedChain.meta?.name ??
    resolvedChain.blockchain?.name ??
    slug;
  const chainDescription = resolvedChain.meta?.description ??
    SUBNET_DESCRIPTIONS[slug] ??
    `${ chainName } is a blockchain on the network.`;

  const blockchainId = resolvedChain.blockchain?.id ?? '';
  const subnetId = resolvedChain.blockchain?.subnetID ?? (resolvedChain.isPrimary ? PRIMARY_NETWORK_ID : '');
  const vmId = resolvedChain.blockchain?.vmID ?? resolvedChain.meta?.vmId ?? '';
  const vmName = KNOWN_VM_IDS[vmId] ?? (vmId ? truncateId(vmId) : 'Unknown');
  const chainId = SUBNET_CHAIN_IDS[slug];
  const explorerUrl = EXPLORER_URLS[slug];
  const isLoading = chainsLoading || validatorsLoading;

  const subnet = React.useMemo(
    () => subnets.find((s) => s.id === subnetId),
    [ subnets, subnetId ],
  );

  const subnetChains = React.useMemo(
    () => subnetId ? blockchains.filter((c) => c.subnetID === subnetId) : [],
    [ blockchains, subnetId ],
  );

  const totalStake = React.useMemo(
    () => validators.reduce((sum, v) => sum + BigInt(v.stakeAmount || v.weight || '0'), BigInt(0)),
    [ validators ],
  );

  return (
    <>
      <PageTitle
        title={ chainName }
        secondRow={ (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-text-secondary)]">Chain Details</span>
            { resolvedChain.isPrimary && <Tag size="sm" variant="subtle">Primary Network</Tag> }
            { !resolvedChain.isPrimary && resolvedChain.blockchain && <Tag size="sm" variant="subtle">L1</Tag> }
          </div>
        ) }
      />

      <div className="p-4 mb-6 border border-[var(--color-border-divider)] rounded-lg bg-[var(--color-gray-50)] dark:bg-[var(--color-whiteAlpha-50)]">
        <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          { chainDescription }
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="p-4 border border-[var(--color-border-divider)] rounded-lg bg-[var(--color-gray-50)] dark:bg-[var(--color-whiteAlpha-50)]">
          <span className="block text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">
            Validators
          </span>
          <Skeleton loading={ isLoading }>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">
              { validators.length }
            </span>
          </Skeleton>
        </div>
        <div className="p-4 border border-[var(--color-border-divider)] rounded-lg bg-[var(--color-gray-50)] dark:bg-[var(--color-whiteAlpha-50)]">
          <span className="block text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">
            Total Stake
          </span>
          <Skeleton loading={ isLoading }>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">
              { formatStake(totalStake) } { config.chain.currency.symbol || 'LUX' }
            </span>
          </Skeleton>
        </div>
        <div className="p-4 border border-[var(--color-border-divider)] rounded-lg bg-[var(--color-gray-50)] dark:bg-[var(--color-whiteAlpha-50)]">
          <span className="block text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">
            Subnet Chains
          </span>
          <Skeleton loading={ isLoading }>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">
              { subnetChains.length }
            </span>
          </Skeleton>
        </div>
        <div className="p-4 border border-[var(--color-border-divider)] rounded-lg bg-[var(--color-gray-50)] dark:bg-[var(--color-whiteAlpha-50)]">
          <span className="block text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">
            Threshold
          </span>
          <Skeleton loading={ isLoading }>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">
              { subnet?.threshold ?? '-' }
            </span>
          </Skeleton>
        </div>
      </div>

      <div className="mb-6">
        <span className="block text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Chain Info
        </span>
        <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
          <InfoRow label="Chain Name" value={ chainName }/>
          { blockchainId && <InfoRow label="Blockchain ID" value={ blockchainId } isMono canCopy/> }
          { subnetId && <InfoRow label="Subnet ID" value={ subnetId } isMono canCopy/> }
          <InfoRow label="VM Name" value={ vmName }/>
          { vmId && <InfoRow label="VM ID" value={ vmId } isMono canCopy/> }
          { chainId != null && <InfoRow label="EVM Chain ID" value={ String(chainId) }/> }
          { explorerUrl && <InfoRow label="Explorer" value={ explorerUrl }/> }
          { resolvedChain.isPrimary && <InfoRow label="Network" value="Primary Network"/> }
          { !resolvedChain.isPrimary && <InfoRow label="Network" value="L1 Subnet"/> }
        </div>
      </div>

      { indexerStats && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              Indexer Stats
            </span>
            { indexerStats.dag_stats && (
              <Tag size="sm" variant="subtle">
                { indexerStats.dag_stats.chain_type.toUpperCase() }
              </Tag>
            ) }
          </div>
          <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
            { indexerStats.dag_stats && (
              <>
                <InfoRow label="Total Vertices" value={ String(indexerStats.dag_stats.total_vertices) }/>
                <InfoRow label="Total Edges" value={ String(indexerStats.dag_stats.total_edges) }/>
                <InfoRow label="Accepted Vertices" value={ String(indexerStats.dag_stats.accepted_vertices) }/>
                <InfoRow label="Pending Vertices" value={ String(indexerStats.dag_stats.pending_vertices) }/>
                <InfoRow label="Last Updated" value={ indexerStats.dag_stats.last_updated }/>
              </>
            ) }
            { Object.entries(indexerStats.chain_stats).map(([ key, value ]) => (
              <InfoRow
                key={ key }
                label={ key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }
                value={ typeof value === 'object' ? JSON.stringify(value) : String(value) }
              />
            )) }
          </div>
        </div>
      ) }

      { subnetChains.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              Chains in Subnet
            </span>
            <Tag size="sm" variant="subtle">{ subnetChains.length }</Tag>
          </div>
          <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
            <div className="hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]">
              <div className="flex-1 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
                Name
              </div>
              <div className="flex-[2] text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
                Blockchain ID
              </div>
              <div className="w-[120px] text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
                VM
              </div>
            </div>
            { subnetChains.map((chain) => (
              <div
                key={ chain.id }
                className="flex px-4 py-3 gap-4 border-b border-[var(--color-border-divider)] last:border-b-0 hover:bg-[var(--color-gray-50)] dark:hover:bg-[var(--color-whiteAlpha-50)] transition-colors duration-150 flex-wrap lg:flex-nowrap"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    { chain.name }
                  </span>
                </div>
                <div className="flex-[2] min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-mono text-[var(--color-text-secondary)]" title={ chain.id }>
                      { truncateId(chain.id, 24) }
                    </span>
                    <CopyToClipboard text={ chain.id } size="2xs"/>
                  </div>
                </div>
                <div className="w-[120px]">
                  <div className="inline-block bg-[var(--color-gray-100)] dark:bg-[var(--color-whiteAlpha-100)] text-[var(--color-text-secondary)] rounded-sm px-2 py-0.5 text-xs font-mono">
                    { KNOWN_VM_IDS[chain.vmID] ?? truncateId(chain.vmID, 12) }
                  </div>
                </div>
              </div>
            )) }
          </div>
        </div>
      ) }

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            Validators
          </span>
          <Skeleton loading={ validatorsLoading }>
            <Tag size="sm" variant="subtle">{ validators.length }</Tag>
          </Skeleton>
        </div>
        <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
          <div className="hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)] items-center">
            <div className="w-10 shrink-0 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
              #
            </div>
            <div className="flex-[2] text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
              Node ID
            </div>
            <div className="flex-1 text-right text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
              Stake
            </div>
            <div className="w-20 text-right shrink-0 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
              Uptime
            </div>
            <div className="w-10 shrink-0 text-center text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
              { '\u2022' }
            </div>
          </div>

          { validatorsLoading && (
            <div className="px-4 py-6">
              <Skeleton loading h="16px" mb={ 3 }/>
              <Skeleton loading h="16px" mb={ 3 }/>
              <Skeleton loading h="16px" mb={ 3 }/>
              <Skeleton loading h="16px"/>
            </div>
          ) }

          { !validatorsLoading && validators.length === 0 && (
            <div className="px-4 py-8 text-center text-[var(--color-text-secondary)] text-sm">
              No validators found
            </div>
          ) }

          { !validatorsLoading && validators.map((v, i) => (
            <ValidatorRow key={ v.nodeID } validator={ v } index={ i }/>
          )) }
        </div>
      </div>
    </>
  );
};

export default ChainDetailPage;
