// Cross-chain bridge/teleporter page for the Lux multi-chain explorer.
// Shows cross-chain transfers between Primary Network chains and L1 subnets.

import React from 'react';

import config from 'configs/app';
import { useBridgeData } from 'lib/api/bchain';
import { useBlockchains, useCurrentValidators } from 'lib/api/pchain';
import type { PChainBlockchain } from 'lib/api/pchain';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import PageTitle from 'ui/shared/Page/PageTitle';

// ── Constants ──

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';

// Only live primary network chains. Planned chains are excluded from bridge routes.
const CHAIN_LABELS: Readonly<Record<string, string>> = {
  C: 'C-Chain',
  P: 'P-Chain',
  X: 'X-Chain',
};

// Map P-chain internal blockchain names to display names
const L1_DISPLAY_NAMES: Readonly<Record<string, string>> = {
  pars: 'Pars', pars2: 'Pars', pars3: 'Pars',
  spc: 'SPC', spc2: 'SPC', spc3: 'SPC',
  hanzo: 'Hanzo', hanzo2: 'Hanzo', hanzo3: 'Hanzo',
  zoo: 'Zoo', zoo2: 'Zoo', zoo3: 'Zoo',
};

function getL1DisplayName(rawName: string): string {
  return L1_DISPLAY_NAMES[rawName] ?? rawName;
}

// ── Sub-components ──

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const StatCard = ({ label, value, isLoading }: StatCardProps) => (
  <div className="border border-[var(--color-border-divider)] rounded-lg p-5 bg-[var(--color-gray-50)] dark:bg-[var(--color-whiteAlpha-50)]">
    <div className="text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">
      { label }
    </div>
    <Skeleton loading={ isLoading }>
      <div className="text-2xl font-bold text-[var(--color-text-primary)]">
        { value }
      </div>
    </Skeleton>
  </div>
);

interface ChainPairCardProps {
  readonly source: string;
  readonly destination: string;
  readonly status: 'active' | 'coming_soon';
}

const ChainPairCard = ({ source, destination, status }: ChainPairCardProps) => (
  <div className="flex items-center py-3 px-4 border-b border-[var(--color-border-divider)] hover:bg-[var(--color-gray-50)] dark:hover:bg-[var(--color-whiteAlpha-50)] transition-colors duration-150 gap-4 flex-wrap lg:flex-nowrap">
    <div className="min-w-[160px] shrink-0">
      <span className="font-medium text-sm text-[var(--color-text-primary)]">
        { source }
      </span>
    </div>
    <span className="text-[var(--color-text-secondary)] text-sm shrink-0">
      { '\u2192' }
    </span>
    <div className="min-w-[160px] shrink-0">
      <span className="font-medium text-sm text-[var(--color-text-primary)]">
        { destination }
      </span>
    </div>
    <div className="ml-0 lg:ml-auto flex items-center">
      { status === 'active' ? (
        <Tag size="sm" variant="subtle" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Tag>
      ) : (
        <Tag size="sm" variant="subtle">Coming Soon</Tag>
      ) }
    </div>
  </div>
);

// ── Main component ──

const BridgePage = () => {
  const { blockchains, isLoading: chainsLoading } = useBlockchains();
  const { stats, isLoading: validatorsLoading } = useCurrentValidators();
  const { stats: bridgeStats, isLoading: bridgeLoading } = useBridgeData();

  const l1Chains = React.useMemo<ReadonlyArray<PChainBlockchain>>(
    () => blockchains.filter((c) => c.subnetID !== PRIMARY_NETWORK_ID),
    [ blockchains ],
  );

  const isLoading = chainsLoading || validatorsLoading || bridgeLoading;

  // Build bridge pairs: Primary chain <-> L1 subnets
  const bridgePairs = React.useMemo(() => {
    const pairs: Array<{ source: string; destination: string; status: 'active' | 'coming_soon' }> = [];

    // Core chain atomic swaps (active)
    pairs.push(
      { source: 'X-Chain', destination: 'C-Chain', status: 'active' },
      { source: 'C-Chain', destination: 'X-Chain', status: 'active' },
      { source: 'P-Chain', destination: 'C-Chain', status: 'active' },
      { source: 'C-Chain', destination: 'P-Chain', status: 'active' },
    );

    // C-Chain <-> each L1 (coming soon)
    for (const chain of l1Chains) {
      const displayName = getL1DisplayName(chain.name);
      // Skip self-referential routes
      if (displayName === 'C-Chain') {
        continue;
      }
      pairs.push({
        source: 'C-Chain',
        destination: displayName,
        status: 'coming_soon',
      });
      pairs.push({
        source: displayName,
        destination: 'C-Chain',
        status: 'coming_soon',
      });
    }

    return pairs;
  }, [ l1Chains ]);

  return (
    <>
      <PageTitle
        title="Bridge"
        secondRow={ (
          <div className="text-sm text-[var(--color-text-secondary)]">
            Cross-chain transfers between { config.chain.name || 'network' } chains
          </div>
        ) }
      />

      { /* Stats */ }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Connected Chains"
          value={ String(l1Chains.length + Object.keys(CHAIN_LABELS).length) }
          isLoading={ isLoading }
        />
        <StatCard
          label="Bridge Routes"
          value={ String(bridgePairs.length) }
          isLoading={ isLoading }
        />
        <StatCard
          label="Bridge Signers"
          value={ bridgeStats.signerCount > 0 ? String(bridgeStats.signerCount) : String(stats.validatorCount) }
          isLoading={ isLoading }
        />
        <StatCard
          label="Active Routes"
          value={ String(bridgePairs.filter((p) => p.status === 'active').length) }
          isLoading={ isLoading }
        />
      </div>

      { /* Bridge routes table */ }
      <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
        <div className="px-4 py-3 font-semibold text-sm text-[var(--color-text-primary)] border-b border-[var(--color-border-divider)]">
          Bridge Routes
        </div>

        { /* Table header */ }
        <div className="hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]">
          <div className="min-w-[160px] shrink-0 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
            Source
          </div>
          <div className="w-5 shrink-0"/>
          <div className="min-w-[160px] shrink-0 text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
            Destination
          </div>
          <div className="ml-auto text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider">
            Status
          </div>
        </div>

        { /* Loading */ }
        { isLoading && (
          <div className="px-4 py-6">
            <Skeleton loading h="16px" mb={ 3 }/>
            <Skeleton loading h="16px" mb={ 3 }/>
            <Skeleton loading h="16px" mb={ 3 }/>
            <Skeleton loading h="16px"/>
          </div>
        ) }

        { /* Routes */ }
        { !isLoading && bridgePairs.map((pair, idx) => (
          <ChainPairCard
            key={ `${ pair.source }-${ pair.destination }-${ idx }` }
            source={ pair.source }
            destination={ pair.destination }
            status={ pair.status }
          />
        )) }
      </div>

      { /* Info card */ }
      <div className="mt-6 p-5 border border-[var(--color-border-divider)] rounded-lg bg-[var(--color-gray-50)] dark:bg-[var(--color-whiteAlpha-50)]">
        <span className="font-semibold text-sm text-[var(--color-text-primary)] mb-2 block">
          { config.chain.name || 'Network' } Bridge
        </span>
        <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          The bridge enables cross-chain asset transfers between the Primary Network
          chains and L1 subnet chains. Atomic swaps between core chains (C, P, X) are
          currently active. Teleporter-based transfers to L1 subnets are coming soon.
        </span>
      </div>
    </>
  );
};

export default React.memo(BridgePage);
