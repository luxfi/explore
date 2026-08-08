import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import type { PrimaryVm } from 'configs/app/primaryChains';
import { getPrimaryVm } from 'configs/app/primaryChains';
import type { Head } from 'lib/api/chain';
import { useChainFacts } from 'lib/api/chain';
import { useBlockchains, useCurrentValidators } from 'lib/api/pchain';
import type { PChainBlockchain, PChainValidator } from 'lib/api/pchain';
import { cn } from 'lib/utils/cn';
import DexPage from 'ui/dex/DexPage';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import PageTitle from 'ui/shared/Page/PageTitle';
import PrimaryNetworkGuard from 'ui/shared/PrimaryNetworkGuard';

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
// nLUX is NANO-LUX: 10^9 nLUX = 1 LUX. This read 6, inflating every LUX figure
// by 1000 — the validators page showed 2.5T LUX staked against a ~2T supply.
const LUX_DECIMALS = 9;

// Primary-network VM identity (name / vm / vmId / description / view) comes from
// the single source of truth in configs/app/primaryChains.ts.

const L1_EVM_CHAIN_IDS: Readonly<Record<string, number>> = {
  zoo: 200200,
  hanzo: 36963,
  spc: 36911,
  pars: 494949,
};

const L1_DESCRIPTIONS: Readonly<Record<string, string>> = {
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

// A chain that we cannot reach and a chain sitting at genesis are different
// states. Rendering the first as 0 is the fabricated zero — it reads as a
// measurement and is not one.
function headValue(head: Head): string {
  switch (head.kind) {
    case 'height': return head.height.toLocaleString();
    case 'unreachable': return 'No public RPC';
    default: return 'Unknown';
  }
}

// Each VM names its head after its own data model. Calling the X-Chain's a
// "block height" is the same category error as giving it a gas column.
function headLabel(vm: PrimaryVm | undefined): string {
  switch (vm?.view) {
    case 'platform': return 'P-Chain Height';
    case 'utxo': return 'Accepted Height';
    default: return 'Block Height';
  }
}

function bootstrapLabel(b: boolean | null): string {
  if (b === null) return 'Unknown';
  return b ? 'Bootstrapped' : 'Syncing';
}

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading?: boolean;
}

const StatCard = ({ label, value, isLoading = false }: StatCardProps) => (
  <div className="p-4 border border-[var(--color-border-divider)] rounded-lg bg-[var(--color-gray-50)] dark:bg-[var(--color-whiteAlpha-50)]">
    <span className="block text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">
      { label }
    </span>
    <Skeleton loading={ isLoading }>
      <span className="text-xl font-bold text-[var(--color-text-primary)]">{ value }</span>
    </Skeleton>
  </div>
);

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
        <div className={ cn('w-2 h-2 rounded-full inline-block', validator.connected ? 'bg-good' : 'bg-gray-400') }/>
      </div>
    </div>
  );
};

const ChainDetailPage = () => {
  const router = useRouter();
  const slug = (router.query.slug as string || '').toLowerCase();

  const { blockchains } = useBlockchains();
  const { validators, isLoading: validatorsLoading } = useCurrentValidators();

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
    L1_DESCRIPTIONS[slug] ??
    `${ chainName } is a blockchain on the network.`;

  const blockchainId = resolvedChain.blockchain?.id ?? '';
  const netId = resolvedChain.blockchain?.netID ?? (resolvedChain.isPrimary ? PRIMARY_NETWORK_ID : '');
  const vmId = resolvedChain.blockchain?.vmID ?? resolvedChain.meta?.vmId ?? '';
  const vmName = KNOWN_VM_IDS[vmId] ?? (vmId ? truncateId(vmId) : 'Unknown');
  const chainId = L1_EVM_CHAIN_IDS[slug];
  const explorerUrl = EXPLORER_URLS[slug];

  const { facts, isLoading: factsLoading } = useChainFacts(
    resolvedChain.meta,
    resolvedChain.blockchain?.id ?? null,
  );
  const isPlatform = resolvedChain.meta?.view === 'platform';
  // The P-Chain is the registry, so it never lists itself. Every other primary
  // chain has to appear in this network's own answer to be on this network:
  // T, R, I, O are in our metadata table and registered nowhere, and M runs on
  // devnet alone.
  const onThisNetwork = isPlatform ||
    !resolvedChain.isPrimary ||
    blockchains.some((c) => c.name.toLowerCase() === slug);
  const scopeLabel = facts.chainId != null ? 'EVM Chain ID' : 'Network';
  const networkScope = resolvedChain.isPrimary ? 'Primary' : 'Sovereign L1';
  const scopeValue = facts.chainId != null ? String(facts.chainId) : networkScope;

  const netChains = React.useMemo(
    () => netId ? blockchains.filter((c) => c.netID === netId) : [],
    [ blockchains, netId ],
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

      { !onThisNetwork && (
        <div className="p-4 mb-6 border border-[var(--color-border-divider)] rounded-lg">
          <span className="text-sm text-[var(--color-text-secondary)]">
            { chainName } is not registered on { config.chain.name || 'this network' }.
            Nothing below describes it.
          </span>
        </div>
      ) }

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Status" value={ bootstrapLabel(facts.bootstrapped) } isLoading={ factsLoading }/>
        <StatCard label={ headLabel(resolvedChain.meta) } value={ headValue(facts.head) } isLoading={ factsLoading }/>
        { isPlatform ? (
          <>
            <StatCard label="Validators" value={ String(validators.length) } isLoading={ validatorsLoading }/>
            <StatCard
              label="Total Stake"
              value={ `${ formatStake(totalStake) } ${ config.chain.currency.symbol || 'LUX' }` }
              isLoading={ validatorsLoading }
            />
          </>
        ) : (
          <>
            <StatCard label="VM" value={ vmName }/>
            <StatCard label={ scopeLabel } value={ scopeValue }/>
          </>
        ) }
      </div>

      <div className="mb-6">
        <span className="block text-sm font-semibold text-[var(--color-text-primary)] mb-3">
          Chain Info
        </span>
        <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
          <InfoRow label="Chain Name" value={ chainName }/>
          { blockchainId && <InfoRow label="Blockchain ID" value={ blockchainId } isMono canCopy/> }
          { netId && <InfoRow label="Network ID" value={ netId } isMono canCopy/> }
          <InfoRow label="VM Name" value={ vmName }/>
          { vmId && <InfoRow label="VM ID" value={ vmId } isMono canCopy/> }
          { chainId != null && <InfoRow label="EVM Chain ID" value={ String(chainId) }/> }
          { explorerUrl && <InfoRow label="Explorer" value={ explorerUrl }/> }
          { resolvedChain.isPrimary && <InfoRow label="Network" value="Primary Network"/> }
          { !resolvedChain.isPrimary && <InfoRow label="Network" value="Sovereign L1"/> }
        </div>
      </div>

      { netChains.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              Chains on This Network
            </span>
            <Tag size="sm" variant="subtle">{ netChains.length }</Tag>
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
            { netChains.map((chain) => (
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

      { /* Validators are the P-Chain's data model, not every chain's. Listing
           the same primary-network validator set under Q-Chain and Z-Chain and
           K-Chain is what made all fifteen pages read alike. */ }
      { isPlatform && (
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
      ) }

      { /* Say it plainly. The chain is registered on the P-Chain and running on
           the node, but the gateway routes only P, X and C, so no head can be
           read from a browser. An empty panel here would read as "nothing
           happening on this chain", which is a different and false claim. */ }
      { facts.head.kind === 'unreachable' && (
        <div className="mb-6 p-4 border border-[var(--color-border-divider)] rounded-lg">
          <span className="text-sm text-[var(--color-text-secondary)]">
            { chainName } is registered on the primary network and
            { facts.bootstrapped === true ? ' bootstrapped on the node' : ' not yet bootstrapped' }
            , but its RPC is not published on { config.chain.name || 'this network' }&apos;s public gateway,
            so its height and contents cannot be read here.
          </span>
        </div>
      ) }
    </PrimaryNetworkGuard>
  );
};

export default ChainDetailPage;
