// Cross-chain bridge/teleporter page for the Lux multi-chain explorer.
// Shows cross-chain transfers between Primary Network chains and sovereign L1s.

import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import React from 'react';

import config from 'configs/app';
import { useBlockchains } from 'lib/api/pchain';
import type { PChainBlockchain } from 'lib/api/pchain';
import PageTitle from 'ui/shared/Page/PageTitle';

// ── Constants ──

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';

// ── Sub-components ──

interface ChainPairCardProps {
  readonly source: string;
  readonly destination: string;
  readonly status: 'active' | 'coming_soon';
}

const ChainPairCard = ({ source, destination, status }: ChainPairCardProps) => (
  <div className={ `
    flex items-center py-3 px-4 border-b border-[var(--color-border-divider)] hover:bg-[var(--color-gray-50)]
    dark:hover:bg-[var(--color-whiteAlpha-50)] transition-colors duration-150 gap-4 flex-wrap lg:flex-nowrap
  ` }>
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
        <Tag size="sm" variant="subtle" className="bg-good/10 text-good dark:bg-good/10 dark:text-good">Active</Tag>
      ) : (
        <Tag size="sm" variant="subtle">Coming Soon</Tag>
      ) }
    </div>
  </div>
);

// ── Main component ──

const BridgePage = () => {
  const { blockchains, isLoading } = useBlockchains();

  const l1Chains = React.useMemo<ReadonlyArray<PChainBlockchain>>(
    () => blockchains.filter((c) => c.netID !== PRIMARY_NETWORK_ID),
    [ blockchains ],
  );

  // Build bridge pairs: Primary chain <-> sovereign L1s
  const bridgePairs = React.useMemo(() => {
    const pairs: Array<{ source: string; destination: string; status: 'active' | 'coming_soon' }> = [];

    // C-Chain <-> each L1
    for (const chain of l1Chains) {
      pairs.push({ source: 'C-Chain', destination: chain.name, status: 'coming_soon' });
      pairs.push({ source: chain.name, destination: 'C-Chain', status: 'coming_soon' });
    }

    // X-Chain <-> C-Chain (atomic swaps)
    pairs.unshift(
      { source: 'X-Chain', destination: 'C-Chain', status: 'active' },
      { source: 'C-Chain', destination: 'X-Chain', status: 'active' },
      { source: 'P-Chain', destination: 'C-Chain', status: 'active' },
      { source: 'C-Chain', destination: 'P-Chain', status: 'active' },
    );

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
          chains and sovereign L1 chains. Atomic swaps between core chains (C, P, X) are
          currently active. Transfers to sovereign L1s are
          coming soon via the B-Chain bridge relay.
        </span>
      </div>
    </>
  );
};

export default React.memo(BridgePage);
