import React from 'react';

import config from 'configs/app';
import { isPrimaryExplorer } from 'configs/app/chainRegistry';
import { useBlockchains, useChainHeights, useCurrentValidators } from 'lib/api/pchain';
import type { PChainBlockchain } from 'lib/api/pchain';
import { cn } from 'lib/utils/cn';
import { Heading } from '@luxfi/ui/heading';
import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import { HomeRpcDataContextProvider } from 'ui/home/fallbacks/rpcDataContext';
import HeroBanner from 'ui/home/HeroBanner';
import LatestBlocks from 'ui/home/LatestBlocks';
import Stats from 'ui/home/Stats';
import Transactions from 'ui/home/Transactions';

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const LUX_DECIMALS = 6;

// Only C, P, X are deployed and live. Others are planned (VM types exist but not deployed).
const PRIMARY_CHAINS = [
  { id: 'C', name: 'C-Chain', fullName: 'Contract Chain', vm: 'EVM', href: '/', isLive: true },
  { id: 'P', name: 'P-Chain', fullName: 'Platform Chain', vm: 'PVM', href: '/validators', isLive: true },
  { id: 'X', name: 'X-Chain', fullName: 'Exchange Chain', vm: 'AVM', href: '/chain/x-chain', isLive: true },
] as const;

// Planned chains -- shown separately, not counted in active stats
const PLANNED_CHAINS = [
  { id: 'D', name: 'D-Chain', fullName: 'DEX Chain', vm: 'DexVM' },
  { id: 'A', name: 'A-Chain', fullName: 'AI Chain', vm: 'AIVM' },
  { id: 'B', name: 'B-Chain', fullName: 'Bridge Chain', vm: 'BridgeVM' },
  { id: 'Q', name: 'Q-Chain', fullName: 'Quantum Chain', vm: 'QuantumVM' },
  { id: 'T', name: 'T-Chain', fullName: 'Threshold Chain', vm: 'ThresholdVM' },
  { id: 'Z', name: 'Z-Chain', fullName: 'ZK Chain', vm: 'ZKVM' },
  { id: 'G', name: 'G-Chain', fullName: 'Graph Chain', vm: 'GraphVM' },
  { id: 'K', name: 'K-Chain', fullName: 'Key Chain', vm: 'KeyVM' },
  { id: 'O', name: 'O-Chain', fullName: 'Oracle Chain', vm: 'OracleVM' },
  { id: 'R', name: 'R-Chain', fullName: 'Relay Chain', vm: 'RelayVM' },
  { id: 'I', name: 'I-Chain', fullName: 'Identity Chain', vm: 'IdentityVM' },
] as const;

// Known L1 chains (fallback when P-chain API is unreachable from browser)
const KNOWN_L1_CHAINS: ReadonlyArray<{ readonly name: string; readonly href: string }> = [
  { name: 'Zoo', href: 'https://explore-zoo.lux.network' },
  { name: 'Hanzo', href: 'https://explore-hanzo.lux.network' },
  { name: 'SPC', href: 'https://explore-spc.lux.network' },
  { name: 'Pars', href: 'https://explore-pars.lux.network' },
];

const L1_EXPLORER_URLS: Readonly<Record<string, string>> = {
  Zoo: 'https://explore-zoo.lux.network',
  Hanzo: 'https://explore-hanzo.lux.network',
  SPC: 'https://explore-spc.lux.network',
  Pars: 'https://explore-pars.lux.network',
};

// Map P-chain internal blockchain names to display names.
// The P-chain API returns names like "pars3", "spc2", "hanzo2", "zoo2".
const L1_DISPLAY_NAMES: Readonly<Record<string, string>> = {
  pars: 'Pars', pars2: 'Pars', pars3: 'Pars',
  spc: 'SPC', spc2: 'SPC', spc3: 'SPC',
  hanzo: 'Hanzo', hanzo2: 'Hanzo', hanzo3: 'Hanzo',
  zoo: 'Zoo', zoo2: 'Zoo', zoo3: 'Zoo',
};

function getL1DisplayName(rawName: string): string {
  return L1_DISPLAY_NAMES[rawName] ?? rawName;
}

function formatStake(nanoLux: bigint): string {
  const lux = Number(nanoLux) / Math.pow(10, LUX_DECIMALS);
  if (lux >= 1_000_000_000) return `${ (lux / 1_000_000_000).toFixed(1) }B`;
  if (lux >= 1_000_000) return `${ (lux / 1_000_000).toFixed(1) }M`;
  if (lux >= 1_000) return `${ (lux / 1_000).toFixed(1) }K`;
  return lux.toFixed(0);
}

// ── Hero metric (compact inline stat) ──

interface MetricProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const Metric = ({ label, value, isLoading }: MetricProps) => (
  <div className="flex flex-col items-center px-4 py-1">
    <Skeleton loading={ isLoading }>
      <span className="font-mono text-lg text-[var(--color-text-primary)] font-bold leading-tight">
        { value }
      </span>
    </Skeleton>
    <span className="text-2xs uppercase tracking-[0.08em] text-[var(--color-text-secondary)] mt-1 font-medium">
      { label }
    </span>
  </div>
);

// ── Chain row (compact, for sidebar) ──

interface ChainRowProps {
  readonly name: string;
  readonly fullName: string;
  readonly vm: string;
  readonly href: string | undefined;
  readonly height?: number;
  readonly heightLoading?: boolean;
}

const ChainRow = ({
  name, fullName, vm, href, height, heightLoading,
}: ChainRowProps) => {
  const content = (
    <div className={ cn(
      'flex items-center justify-between transition-all rounded-md px-3 py-2.5 gap-3',
      href ?
        'cursor-pointer hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-whiteAlpha-100)]' :
        'cursor-default',
    ) }>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-[var(--color-text-primary)] font-semibold whitespace-nowrap">
          { name }
        </span>
        <span className="text-xs text-[var(--color-text-secondary)] hidden lg:inline whitespace-nowrap">
          { fullName }
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        { height !== undefined && (
          <Skeleton loading={ heightLoading }>
            <span className="font-mono text-xs text-[var(--color-text-secondary)]">
              { height > 0 ? `#${ height.toLocaleString() }` : '' }
            </span>
          </Skeleton>
        ) }
        <Tag size="sm" variant="subtle">{ vm }</Tag>
      </div>
    </div>
  );

  if (href) {
    return <Link href={ href } variant="plain">{ content }</Link>;
  }
  return content;
};

// ── L1 Chain row ──

interface L1ChainRowProps {
  readonly chain: PChainBlockchain;
}

const L1ChainRow = ({ chain }: L1ChainRowProps) => {
  const displayName = getL1DisplayName(chain.name);
  const explorerUrl = L1_EXPLORER_URLS[displayName];

  const content = (
    <div className={ cn(
      'flex items-center justify-between cursor-pointer transition-colors rounded-md px-3 py-2',
      'hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-whiteAlpha-100)]',
    ) }>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--color-text-primary)] font-semibold">
          { displayName }
        </span>
        <span className="font-mono text-xs text-[var(--color-text-secondary)] hidden lg:inline">
          { chain.id.slice(0, 8) }...
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-[var(--color-text-secondary)]">{ '\u2192' }</span>
      </div>
    </div>
  );

  if (explorerUrl) {
    return <Link href={ explorerUrl } variant="plain" target="_blank">{ content }</Link>;
  }
  const slug = displayName.toLowerCase();
  return <Link href={ `/chains/${ slug }` } variant="plain">{ content }</Link>;
};

// ── Known L1 chain row (fallback when API unavailable) ──

interface KnownL1RowProps {
  readonly name: string;
  readonly href: string;
}

const KnownL1Row = ({ name, href }: KnownL1RowProps) => (
  <Link href={ href } variant="plain" target="_blank">
    <div className={ cn(
      'flex items-center justify-between cursor-pointer transition-colors rounded-md px-3 py-2',
      'hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-whiteAlpha-100)]',
    ) }>
      <span className="text-sm text-[var(--color-text-primary)] font-semibold">
        { name }
      </span>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-[var(--color-text-secondary)]">{ '\u2192' }</span>
      </div>
    </div>
  </Link>
);

// ── Section card ──

interface SectionCardProps {
  readonly title: string;
  readonly count?: number;
  readonly isLoading?: boolean;
  readonly action?: { label: string; href: string };
  readonly children: React.ReactNode;
}

const SectionCard = ({ title, count, isLoading, action, children }: SectionCardProps) => (
  <div className="rounded-sm p-4 border border-[var(--color-border-divider)] bg-[var(--color-stats-bg)]">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Heading level="3" className="text-sm">{ title }</Heading>
        { count !== undefined && (
          <Skeleton loading={ isLoading }>
            <Tag size="sm" variant="subtle">{ count }</Tag>
          </Skeleton>
        ) }
      </div>
      { action && (
        <Link href={ action.href } className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          { action.label }
        </Link>
      ) }
    </div>
    { children }
  </div>
);

// ── Primary explorer content (C-Chain: validators, chains, P-chain data) ──
// Rendered only on the main Lux C-Chain explorer. The P-chain hooks are called
// here so they never fire on subnet deployments.

const PrimaryContent = () => {
  const { stats, isLoading: validatorsLoading, isError: validatorsError } = useCurrentValidators();
  const { blockchains, isLoading: chainsLoading } = useBlockchains();
  const { pChainHeight, cChainHeight, isLoading: heightsLoading } = useChainHeights();

  const l1Chains = React.useMemo(
    () => blockchains.filter((c) => c.subnetID !== PRIMARY_NETWORK_ID),
    [ blockchains ],
  );

  const hasL1Data = l1Chains.length > 0;
  const showFallbackL1 = !chainsLoading && !hasL1Data;
  // Only count live primary chains + L1 chains in the total
  const totalChains = PRIMARY_CHAINS.length + (hasL1Data ? l1Chains.length : KNOWN_L1_CHAINS.length);
  const isLoading = validatorsLoading || chainsLoading;
  const hasValidatorData = !validatorsError && stats.validatorCount > 0;

  return (
    <>
      { /* ── Metrics strip ── */ }
      <div className={ cn(
        'flex items-center justify-center flex-wrap overflow-x-auto rounded-sm',
        'py-3 px-4 gap-x-6 gap-y-3 border border-[var(--color-border-divider)]',
        'bg-[var(--color-stats-bg)]',
      ) }>
        <Metric
          label="Validators"
          value={ hasValidatorData ? String(stats.validatorCount) : '\u2014' }
          isLoading={ validatorsLoading }
        />
        <div className="w-px h-7 hidden md:block bg-[var(--color-border-divider)]"/>
        <Metric
          label="Staked"
          value={ hasValidatorData ?
            `${ formatStake(stats.totalStake) } ${ config.chain.currency.symbol || 'LUX' }` :
            '\u2014' }
          isLoading={ validatorsLoading }
        />
        <div className="w-px h-7 hidden md:block bg-[var(--color-border-divider)]"/>
        <Metric
          label="Uptime"
          value={ hasValidatorData ? `${ stats.averageUptime.toFixed(1) }%` : '\u2014' }
          isLoading={ validatorsLoading }
        />
        <div className="w-px h-7 hidden md:block bg-[var(--color-border-divider)]"/>
        <Metric
          label="Chains"
          value={ String(totalChains) }
          isLoading={ isLoading }
        />
        <div className="w-px h-7 hidden md:block bg-[var(--color-border-divider)]"/>
        <Metric
          label="Connected"
          value={ hasValidatorData ? `${ stats.connectedCount }/${ stats.validatorCount }` : '\u2014' }
          isLoading={ validatorsLoading }
        />
      </div>

      { /* ── Stats widgets ── */ }
      <Stats/>

      { /* ── Latest blocks ── */ }
      <div className="rounded-sm border border-[var(--color-border-divider)] bg-[var(--color-stats-bg)] p-4 lg:p-6">
        <LatestBlocks/>
      </div>

      { /* ── Latest transactions ── */ }
      <div className="rounded-sm border border-[var(--color-border-divider)] bg-[var(--color-stats-bg)] p-4 lg:p-6">
        <Transactions/>
      </div>

      { /* ── Chain Health ── */ }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-4">
        { /* Primary Network chains */ }
        <SectionCard
          title="Primary Network"
          count={ PRIMARY_CHAINS.length }
        >
          <div className="flex flex-col gap-0.5">
            { PRIMARY_CHAINS.map((chain) => {
              const chainHeight = (() => {
                if (chain.id === 'C') return cChainHeight;
                if (chain.id === 'P') return pChainHeight;
                return undefined;
              })();
              return (
                <ChainRow
                  key={ chain.id }
                  name={ chain.name }
                  fullName={ chain.fullName }
                  vm={ chain.vm }
                  href={ chain.isLive ? chain.href : undefined }
                  height={ chainHeight }
                  heightLoading={ heightsLoading }
                />
              );
            }) }
            { PLANNED_CHAINS.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[var(--color-border-divider)]">
                <span className="text-2xs uppercase tracking-wider text-[var(--color-text-secondary)] px-3 font-medium">
                  Planned ({ PLANNED_CHAINS.length })
                </span>
                { PLANNED_CHAINS.map((chain) => (
                  <ChainRow
                    key={ chain.id }
                    name={ chain.name }
                    fullName={ chain.fullName }
                    vm={ chain.vm }
                    href={ undefined }
                  />
                )) }
              </div>
            ) }
          </div>
        </SectionCard>

        { /* L1 chains */ }
        <SectionCard
          title="Chains"
          count={ hasL1Data ? l1Chains.length : KNOWN_L1_CHAINS.length }
          isLoading={ chainsLoading }
          action={{ label: 'View all', href: '/chains' }}
        >
          { chainsLoading && (
            <div className="flex flex-col gap-1">
              { Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={ i } loading h="40px" borderRadius="md"/>
              )) }
            </div>
          ) }
          { !chainsLoading && hasL1Data && (
            <div className="flex flex-col gap-0.5">
              { l1Chains.map((chain) => (
                <L1ChainRow key={ chain.id } chain={ chain }/>
              )) }
            </div>
          ) }
          { showFallbackL1 && (
            <div className="flex flex-col gap-0.5">
              { KNOWN_L1_CHAINS.map((chain) => (
                <KnownL1Row key={ chain.name } name={ chain.name } href={ chain.href }/>
              )) }
            </div>
          ) }
        </SectionCard>

        { /* Validators summary card */ }
        <SectionCard title="Validators">
          { !hasValidatorData && !validatorsLoading ? (
            <div className="flex flex-col items-center py-4">
              <span className="text-sm text-[var(--color-text-secondary)]">
                { validatorsError ? 'Unable to fetch validator data.' : 'No validator data available.' }
              </span>
              <Link href="/validators" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mt-2">
                View validators
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton loading={ validatorsLoading }>
                    <span className="font-mono text-lg font-bold text-[var(--color-text-primary)]">
                      { hasValidatorData ? stats.validatorCount : '\u2014' }
                    </span>
                  </Skeleton>
                  <span className="text-2xs text-[var(--color-text-secondary)]">Active</span>
                </div>
                <div>
                  <Skeleton loading={ validatorsLoading }>
                    <span className="font-mono text-lg font-bold text-[var(--color-text-primary)]">
                      { hasValidatorData ? formatStake(stats.totalStake) : '\u2014' }
                    </span>
                  </Skeleton>
                  <span className="text-2xs text-[var(--color-text-secondary)]">Total Stake ({ config.chain.currency.symbol || 'LUX' })</span>
                </div>
                <div>
                  <Skeleton loading={ validatorsLoading }>
                    <span className="font-mono text-lg font-bold text-[var(--color-text-primary)]">
                      { hasValidatorData ? stats.delegatorCount : '\u2014' }
                    </span>
                  </Skeleton>
                  <span className="text-2xs text-[var(--color-text-secondary)]">Delegators</span>
                </div>
                <div>
                  <Skeleton loading={ validatorsLoading }>
                    <span className="font-mono text-lg font-bold text-[var(--color-text-primary)]">
                      { hasValidatorData ? `${ stats.connectedCount }/${ stats.validatorCount }` : '\u2014' }
                    </span>
                  </Skeleton>
                  <span className="text-2xs text-[var(--color-text-secondary)]">Connected</span>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <Link href="/validators" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                  View validators
                </Link>
              </div>
            </>
          ) }
        </SectionCard>
      </div>
    </>
  );
};

// ── Subnet content (Zoo, Pars, Hanzo, SPC — EVM stats, blocks, txs only) ──
// No P-chain hooks, no validator metrics, no chain grid.

const SubnetContent = () => (
  <>
    <Stats/>

    <div className="rounded-sm border border-[var(--color-border-divider)] bg-[var(--color-stats-bg)] p-4 lg:p-6">
      <LatestBlocks/>
    </div>

    <div className="rounded-sm border border-[var(--color-border-divider)] bg-[var(--color-stats-bg)] p-4 lg:p-6">
      <Transactions/>
    </div>
  </>
);

// ── Main page ──

const NetworkOverview = () => {
  const isPrimary = isPrimaryExplorer();

  return (
    <HomeRpcDataContextProvider>
      <div className="flex flex-col gap-4 lg:gap-6">
        <HeroBanner/>
        { isPrimary ? <PrimaryContent/> : <SubnetContent/> }
      </div>
    </HomeRpcDataContextProvider>
  );
};

export default React.memo(NetworkOverview);
