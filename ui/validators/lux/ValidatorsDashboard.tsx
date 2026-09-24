import { Skeleton } from '@luxfi/ui/skeleton';
import React from 'react';

import { getPChain } from 'configs/app/chainRegistry';
import type { PChainValidator, ValidatorStats } from 'lib/api/pchain';

import { formatStake, truncateNodeId } from './utils';

// What an unanswered read looks like. Never a zero: this page printed
// "0 validators / 0 LUX staked" about a network running five with
// 2,500,000,000 LUX bonded, because a failed read leaves the stats zeroed.
const UNKNOWN = '\u2014';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOP_VALIDATORS_COUNT = 20;
const PERCENTAGE_SCALE = 100;

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const StatCard = ({ label, value, isLoading }: StatCardProps) => (
  <div>
    <div className="font-semibold">
      { label }
    </div>
    <Skeleton loading={ isLoading }>
      <div className="font-bold">
        { value }
      </div>
    </Skeleton>
  </div>
);

// ---------------------------------------------------------------------------
// Stake breakdown
// ---------------------------------------------------------------------------

interface StakeBreakdownProps {
  readonly stats: ValidatorStats;
  readonly isLoading: boolean;
  readonly isKnown: boolean;
}

const StakeBreakdown = ({ stats, isLoading, isKnown }: StakeBreakdownProps) => {
  const symbol = getPChain()?.symbol;
  const validatorStake = stats.totalStake - stats.totalDelegatedStake;
  const totalNumber = Number(stats.totalStake);
  const validatorPct = totalNumber > 0 ?
    (Number(validatorStake) / totalNumber * PERCENTAGE_SCALE).toFixed(1) :
    '0';
  const delegationPct = totalNumber > 0 ?
    (Number(stats.totalDelegatedStake) / totalNumber * PERCENTAGE_SCALE).toFixed(1) :
    '0';

  return (
    <div>
      <div className="font-semibold">
        Total Stake
      </div>
      <Skeleton loading={ isLoading }>
        <div className="font-bold">
          { isKnown ? `${ formatStake(stats.totalStake) } ${ symbol }` : UNKNOWN }
        </div>
      </Skeleton>
      <Skeleton loading={ isLoading }>
        <div className="flex gap-6 flex-wrap">
          { isKnown ? (
            <>
              <div>Validators: { formatStake(validatorStake) } { symbol } ({ validatorPct }%)</div>
              <div>Delegated: { formatStake(stats.totalDelegatedStake) } { symbol } ({ delegationPct }%)</div>
            </>
          ) : (
            <div className="text-[var(--color-text-secondary)]">
              The P-Chain did not answer — no stake figure to show.
            </div>
          ) }
        </div>
      </Skeleton>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Active validators table (top N)
// ---------------------------------------------------------------------------

interface ActiveValidatorsTableProps {
  readonly validators: ReadonlyArray<PChainValidator>;
  readonly isLoading: boolean;
}

const ActiveValidatorsTable = ({ validators, isLoading }: ActiveValidatorsTableProps) => {
  const symbol = getPChain()?.symbol;
  const sorted = React.useMemo(
    () => [ ...validators ].sort((a, b) => {
      const aStake = BigInt(a.weight);
      const bStake = BigInt(b.weight);
      if (bStake > aStake) return 1;
      if (bStake < aStake) return -1;
      return 0;
    }).slice(0, TOP_VALIDATORS_COUNT),
    [ validators ],
  );

  return (
    <div
      className="overflow-hidden"
    >
      <div className="font-semibold">
        Active Validators (Top { TOP_VALIDATORS_COUNT })
      </div>

      { /* Header */ }
      <div className="flex gap-4 py-2 border-b border-[var(--color-border-divider)]">
        <div className="font-semibold flex-[3] min-w-0">
          Node ID
        </div>
        <div className="font-semibold flex-[2] text-right">
          Stake
        </div>
        <div className="font-semibold flex-1 text-right">
          Delegation Fee
        </div>
      </div>

      { /* Rows */ }
      { isLoading && (
        <div>
          <Skeleton loading/>
          <Skeleton loading/>
          <Skeleton loading/>
        </div>
      ) }

      { !isLoading && sorted.map((v) => (
        <div className="flex gap-4 py-2 border-b border-[var(--color-border-divider)]" key={ v.nodeID }>
          <div
            title={ v.nodeID }
            className="flex-[3] min-w-0 overflow-hidden text-ellipsis"
          >
            { truncateNodeId(v.nodeID) }
          </div>
          <div className="flex-[2] text-right">
            { formatStake(v.weight) } { symbol }
          </div>
          <div className="flex-1 text-right">
            { v.delegationFee }%
          </div>
        </div>
      )) }
    </div>
  );
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

interface ValidatorsDashboardProps {
  readonly validators: ReadonlyArray<PChainValidator>;
  readonly stats: ValidatorStats;
  readonly isLoading: boolean;

  /** False when the P-chain read failed. A zeroed stat is not a measurement. */
  readonly isKnown: boolean;
}

const ValidatorsDashboard = ({ validators, stats, isLoading, isKnown }: ValidatorsDashboardProps) => {
  return (
    <div className="flex flex-col gap-6 text-[var(--color-text-primary)]">
      { /* Stat cards */ }
      { /*
        Connected / Avg Uptime intentionally omitted: the public API node's view of
        its peers (connected, uptime) says how that node is wired, not how the
        network is, so any value here would read as a network fact it is not.
        Only chain-sourced, verifiable metrics are shown.
      */ }
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
      >
        <StatCard
          label="Validators"
          value={ isKnown ? stats.validatorCount.toLocaleString() : UNKNOWN }
          isLoading={ isLoading }
        />
        <StatCard
          label="Delegators"
          value={ isKnown ? stats.delegatorCount.toLocaleString() : UNKNOWN }
          isLoading={ isLoading }
        />
      </div>

      { /* Stake breakdown */ }
      <StakeBreakdown stats={ stats } isLoading={ isLoading } isKnown={ isKnown }/>

      { /* Active validators table */ }
      <ActiveValidatorsTable validators={ validators } isLoading={ isLoading }/>
    </div>
  );
};

export default React.memo(ValidatorsDashboard);
