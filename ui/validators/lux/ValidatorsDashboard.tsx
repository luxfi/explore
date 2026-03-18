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
        <div className="flex">
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
      <div className="flex">
        <div className="font-semibold">
          Node ID
        </div>
        <div className="font-semibold">
          Stake
        </div>
        <div className="font-semibold">
          Delegation Fee
        </div>
        <div className="font-semibold">
          Connected
        </div>
        <div className="font-semibold">
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
        <div className="flex" key={ v.nodeID }>
          <div
            title={ v.nodeID }
            className="overflow-hidden"
          >
            { truncateNodeId(v.nodeID) }
          </div>
          <div className="text-left lg:text-right">
            { formatStake(v.stakeAmount ?? v.weight) } LUX
          </div>
          <div className="text-left lg:text-right">
            { v.delegationFee }%
          </div>
          <div className="flex justify-start lg:justify-center">
            <div/>
          </div>
          <div className="text-left lg:text-right">
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
        className="grid"
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
