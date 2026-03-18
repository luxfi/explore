// Network-level stats: validators, chains, stake, uptime.
// Displayed above the standard Blockscout chain stats on the stats page.

import React from 'react';

import config from 'configs/app';
import { useBlockchains, useCurrentValidators } from 'lib/api/pchain';
import { Skeleton } from 'toolkit/chakra/skeleton';

// ── Constants ──

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const PRIMARY_CHAIN_COUNT = 14;
const LUX_DECIMALS = 6;

const STAT_BG = { _light: 'gray.50', _dark: 'whiteAlpha.50' };

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
    () => blockchains.filter((c) => c.subnetID !== PRIMARY_NETWORK_ID).length,
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
          label="Connected"
          value={ hasValidatorData ? `${ stats.connectedCount }/${ stats.validatorCount }` : '\u2014' }
          isLoading={ isLoading }
        />
        <StatCard
          label="Total Stake"
          value={ hasValidatorData ? `${ formatStake(stats.totalStake) } ${ config.chain.currency.symbol || 'LUX' }` : '\u2014' }
          isLoading={ isLoading }
        />
        <StatCard
          label="Avg Uptime"
          value={ hasValidatorData ? `${ stats.averageUptime.toFixed(1) }%` : '\u2014' }
          isLoading={ isLoading }
        />
      </div>
    </div>
  );
};

export default React.memo(NetworkStats);
