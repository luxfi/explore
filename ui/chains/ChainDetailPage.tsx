import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import type { PrimaryVm } from 'configs/app/primaryChains';
import { getPrimaryVm } from 'configs/app/primaryChains';
import { useBlockchains, useCurrentValidators, useSubnets } from 'lib/api/pchain';
import type { PChainBlockchain, PChainValidator } from 'lib/api/pchain';
import { cn } from 'lib/utils/cn';
import DexPage from 'ui/dex/DexPage';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import PageTitle from 'ui/shared/Page/PageTitle';
import PrimaryNetworkGuard from 'ui/shared/PrimaryNetworkGuard';

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const LUX_DECIMALS = 6;

// Primary-network VM identity (name / vm / vmId / description / view) comes from
// the single source of truth in configs/app/primaryChains.ts.

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
  jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq: 'XVM',
  rWhpuQPF1kb72esV2momhMuTYGkEb1oL29pt2EBXWsBY6MALT: 'PVM',
};

// DAG chain indexer API URLs — one endpoint per primary network chain so
// ChainDetailPage can fetch live stats (block height, vertex count, etc.)
// for any chain the user opens. Missing entries here mean the detail page
// falls back to P-Chain blockchain metadata only, with no realtime stats.
const CHAIN_INDEXER_URLS: Readonly<Record<string, string>> = {
  'c-chain': 'https://api-indexer.lux.network',
  'p-chain': 'https://api-indexer-pchain.lux.network',
  'x-chain': 'https://api-indexer-xchain.lux.network',
  'a-chain': 'https://api-indexer-achain.lux.network',
  'b-chain': 'https://api-indexer-bchain.lux.network',
  'd-chain': 'https://api-indexer-dchain.lux.network',
  'g-chain': 'https://api-indexer-gchain.lux.network',
  'i-chain': 'https://api-indexer-ichain.lux.network',
  'k-chain': 'https://api-indexer-kchain.lux.network',
  'm-chain': 'https://api-indexer-mchain.lux.network',
  'o-chain': 'https://api-indexer-ochain.lux.network',
  'q-chain': 'https://api-indexer-qchain.lux.network',
  'r-chain': 'https://api-indexer-rchain.lux.network',
  't-chain': 'https://api-indexer-tchain.lux.network',
  'z-chain': 'https://api-indexer-zchain.lux.network',
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
      const res = await fetch(`${ indexerUrl }/stats`);
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
  <div className={ cn(
    'flex py-3 px-4 border-b border-[var(--color-border-divider)] gap-4 flex-wrap lg:flex-nowrap',
    'odd:bg-[var(--color-gray-50)] dark:odd:bg-[var(--color-whiteAlpha-50)]',
  ) }>
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
    <div className={ cn(
      'flex py-3 px-4 border-b border-[var(--color-border-divider)] gap-4 items-center flex-wrap lg:flex-nowrap',
      'transition-colors duration-150 hover:bg-[var(--color-gray-50)] dark:hover:bg-[var(--color-whiteAlpha-50)]',
    ) }>
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
    meta: PrimaryVm | undefined;
  }>(() => {
    // Check primary chains first
    const primaryMeta = getPrimaryVm(slug);
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

  // D-Chain (DexVM) renders its native order-book model — the DEX UI — instead
  // of the generic validators/stats detail. DexPage self-guards to the primary
  // explorer, so /chains/d-chain can never leak onto a brand explorer.
  if (resolvedChain.meta?.view === 'dex') {
    return <DexPage/>;
  }

  return (
    <PrimaryNetworkGuard title={ chainName }>
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
                className={ cn(
                  'flex px-4 py-3 gap-4 border-b border-[var(--color-border-divider)] last:border-b-0 flex-wrap lg:flex-nowrap',
                  'transition-colors duration-150 hover:bg-[var(--color-gray-50)] dark:hover:bg-[var(--color-whiteAlpha-50)]',
                ) }
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
                  <div className={ cn(
                    'inline-block bg-[var(--color-gray-100)] dark:bg-[var(--color-whiteAlpha-100)]',
                    'text-[var(--color-text-secondary)] rounded-sm px-2 py-0.5 text-xs font-mono',
                  ) }>
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
    </PrimaryNetworkGuard>
  );
};

export default ChainDetailPage;
