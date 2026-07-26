// Network-level stats: validators, chains, stake, uptime.
// Displayed above the standard Explorer chain stats on the stats page.

import { Skeleton } from '@luxfi/ui/skeleton';
import React from 'react';

import config from 'configs/app';
import { useBlockchains, useCurrentValidators } from 'lib/api/pchain';

// ── Constants ──

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const PRIMARY_CHAIN_COUNT = 14;
const LUX_DECIMALS = 6;

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

// ── Main component ──

const NetworkStats = () => {
  const { stats, isLoading: validatorsLoading, isError: validatorsError } = useCurrentValidators();
  const { blockchains, isLoading: chainsLoading } = useBlockchains();

  const isLoading = validatorsLoading || chainsLoading;

  const l1Count = React.useMemo(
    () => blockchains.filter((c) => c.netID !== PRIMARY_NETWORK_ID).length,
    [ blockchains ],
  );

  const totalChains = PRIMARY_CHAIN_COUNT + l1Count;
  const hasValidatorData = !validatorsError && stats.validatorCount > 0;

  return (
    <div>
      <span className="text-[var(--color-text-secondary)]">
        Network Overview
      </span>
      <div

      >
        <StatCard
          label="Total Chains"
          value={ String(totalChains) }
          isLoading={ isLoading }
        />
        <StatCard
          label="Validators"
          value={ hasValidatorData ? String(stats.validatorCount) : '\u2014' }
          isLoading={ isLoading }
        />
        <StatCard
          label="Total Stake"
          value={ hasValidatorData ? `${ formatStake(stats.totalStake) } ${ config.chain.currency.symbol || 'LUX' }` : '\u2014' }
          isLoading={ isLoading }
        />
        { /*
          Connected / Avg Uptime intentionally omitted: platform.getCurrentValidators
          reports connected=null and uptime=0 on the public RPC, so any value would be
          fabricated. Only chain-verifiable metrics are shown.
        */ }
      </div>
    </div>
  );
};

export default React.memo(NetworkStats);
