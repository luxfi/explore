// Network-level stats: validators, chains, stake, uptime.
// Displayed above the standard Explorer chain stats on the stats page.

import { Skeleton } from '@luxfi/ui/skeleton';
import React from 'react';

import { getPChain, isPrimaryNetworkExplorer } from 'configs/app/chainRegistry';
import { useBlockchains, useCurrentValidators } from 'lib/api/pchain';

// ── Constants ──

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const PRIMARY_CHAIN_COUNT = 14;
// nLUX is NANO-LUX: 10^9 nLUX = 1 LUX. This read 6, inflating every LUX figure
// by 1000 — the validators page showed 2.5T LUX staked against a ~2T supply.
const LUX_DECIMALS = 9;

// ── Helpers ──

function formatStake(nanoLux: bigint): string {
  const lux = Number(nanoLux) / Math.pow(10, LUX_DECIMALS);
  if (lux >= 1_000_000_000) return `${ (lux / 1_000_000_000).toFixed(1) }B`;
  if (lux >= 1_000_000) return `${ (lux / 1_000_000).toFixed(1) }M`;
  if (lux >= 1_000) return `${ (lux / 1_000).toFixed(1) }K`;
  return lux.toFixed(0);
}

// ── Stat card ──

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const StatCard = ({ label, value, isLoading }: StatCardProps) => (
  <div

  >
    <span className="text-[var(--color-text-secondary)]">
      { label }
    </span>
    <Skeleton loading={ isLoading }>
      <span className="text-[var(--color-text-primary)]">
        { value }
      </span>
    </Skeleton>
  </div>
);

// ── Chain count ──

// The Lux primary network's chain list, which a brand explorer does not show,
// so only the Lux explorer renders this and reads the list.
const ChainCount = () => {
  const { blockchains, isLoading } = useBlockchains();

  const l1Count = React.useMemo(
    () => blockchains.filter((c) => c.netID !== PRIMARY_NETWORK_ID).length,
    [ blockchains ],
  );

  return (
    <StatCard
      label="Total Chains"
      value={ String(PRIMARY_CHAIN_COUNT + l1Count) }
      isLoading={ isLoading }
    />
  );
};

// ── Main component ──

const NetworkStats = () => {
  const { stats, isLoading, isKnown: hasValidatorData } = useCurrentValidators();
  const pChain = getPChain();

  return (
    <div>
      { /* Named for whose P-Chain it is: on an L2 brand these are Lux's figures. */ }
      <span className="text-[var(--color-text-secondary)]">
        { pChain?.name }
      </span>
      <div

      >
        { isPrimaryNetworkExplorer() && <ChainCount/> }
        <StatCard
          label="Validators"
          value={ hasValidatorData ? String(stats.validatorCount) : '\u2014' }
          isLoading={ isLoading }
        />
        <StatCard
          label="Total Stake"
          value={ hasValidatorData ? `${ formatStake(stats.totalStake) } ${ pChain?.symbol }` : '\u2014' }
          isLoading={ isLoading }
        />
        { /*
          Connected / Avg Uptime intentionally omitted: they are the public API node's
          view of its peers, not a network fact. Only chain-verifiable metrics are shown.
        */ }
      </div>
    </div>
  );
};

export default React.memo(NetworkStats);
