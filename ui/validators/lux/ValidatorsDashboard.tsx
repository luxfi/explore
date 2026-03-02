import React from 'react';

import type { PChainValidator, ValidatorStats } from 'lib/api/pchain';
import { Skeleton } from '@luxfi/ui/skeleton';

import { formatStake, formatUptime, truncateNodeId } from './utils';

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
}

const StakeBreakdown = ({ stats, isLoading }: StakeBreakdownProps) => {
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
          { formatStake(stats.totalStake) } LUX
        </div>
      </Skeleton>
      <Skeleton loading={ isLoading }>
        <div className="flex gap-6 flex-wrap">
          <div>Validators: { formatStake(validatorStake) } LUX ({ validatorPct }%)</div>
          <div>Delegated: { formatStake(stats.totalDelegatedStake) } LUX ({ delegationPct }%)</div>
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
  const sorted = React.useMemo(
    () => [ ...validators ].sort((a, b) => {
      const aStake = BigInt(a.stakeAmount ?? a.weight);
      const bStake = BigInt(b.stakeAmount ?? b.weight);
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
        <div className="font-semibold flex-1 text-center">
          Connected
        </div>
        <div className="font-semibold flex-1 text-right">
          Uptime
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
            { formatStake(v.stakeAmount ?? v.weight) } LUX
          </div>
          <div className="flex-1 text-right">
            { v.delegationFee }%
          </div>
          <div className="flex-1 flex justify-center">
            <div/>
          </div>
          <div className="flex-1 text-right">
            { formatUptime(v.uptime) }
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
}

const ValidatorsDashboard = ({ validators, stats, isLoading }: ValidatorsDashboardProps) => {
  return (
    <div className="flex flex-col gap-6">
      { /* Stat cards */ }
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        <StatCard
          label="Validators"
          value={ stats.validatorCount.toLocaleString() }
          isLoading={ isLoading }
        />
        <StatCard
          label="Connected"
          value={ `${ stats.connectedCount }/${ stats.validatorCount }` }
          isLoading={ isLoading }
        />
        <StatCard
          label="Delegators"
          value={ stats.delegatorCount.toLocaleString() }
          isLoading={ isLoading }
        />
        <StatCard
          label="Avg Uptime"
          value={ `${ stats.averageUptime.toFixed(1) }%` }
          isLoading={ isLoading }
        />
      </div>

      { /* Stake breakdown */ }
      <StakeBreakdown stats={ stats } isLoading={ isLoading }/>

      { /* Active validators table */ }
      <ActiveValidatorsTable validators={ validators } isLoading={ isLoading }/>
    </div>
  );
};

export default React.memo(ValidatorsDashboard);
