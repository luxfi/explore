import { Skeleton } from '@luxfi/ui/skeleton';
import React from 'react';

import config from 'configs/app';
import type { PChainValidator, ValidatorStats } from 'lib/api/pchain';
import { useNetworkValidators } from 'lib/api/pchain/useNetworkValidators';
import { cn } from 'lib/utils/cn';

import { formatStake, truncateNodeId } from './utils';

const CURRENCY = config.chain.currency.symbol || 'LUX';

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
// Every network's validators
// ---------------------------------------------------------------------------

// The cards above count THIS chain. Zoo and Hanzo run as L2s on the primary
// network and Pars and Osage as their own L1s, so a reader who wants to know
// how much iron is behind Lux needs all of them — a page titled "Validators"
// that shows one network's share is answering a narrower question than the one
// being asked.
//
// On the Lux primary-network explorer every network is listed, including ones
// that did not answer: a chain dropped from the list would read as a chain with
// no validators, and the total says how many answered. A brand explorer has
// only its own chain, so the block does not render there.
const NetworkValidators = () => {
  const { networks, total, isKnown, isLoading, answeredCount, queriedCount } = useNetworkValidators();

  if (networks.length <= 1) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[var(--color-border-divider)] p-4">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-sm font-medium">All networks</span>
        <Skeleton loading={ isLoading }>
          <span className="font-mono text-sm">
            { isKnown ? total.toLocaleString() : UNKNOWN }
            { answeredCount !== queriedCount && (
              <span className="ml-2 text-2xs text-[var(--color-text-secondary)]">
                { answeredCount } of { queriedCount } answered
              </span>
            ) }
          </span>
        </Skeleton>
      </div>
      <div className="flex flex-col gap-1">
        { networks.map((network) => (
          <div key={ network.chainId } className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-secondary)]">{ network.name }</span>
            <Skeleton loading={ network.isLoading }>
              <span className={ cn(
                'font-mono',
                network.status === 'live' ?
                  'text-[var(--color-text-primary)]' :
                  'text-[var(--color-text-secondary)]',
              ) }>
                { network.status === 'live' ? network.validatorCount : network.status }
              </span>
            </Skeleton>
          </div>
        )) }
      </div>
    </div>
  );
};

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
          { isKnown ? `${ formatStake(stats.totalStake) } ${ CURRENCY }` : UNKNOWN }
        </div>
      </Skeleton>
      <Skeleton loading={ isLoading }>
        <div className="flex gap-6 flex-wrap">
          { isKnown ? (
            <>
              <div>Validators: { formatStake(validatorStake) } { CURRENCY } ({ validatorPct }%)</div>
              <div>Delegated: { formatStake(stats.totalDelegatedStake) } { CURRENCY } ({ delegationPct }%)</div>
            </>
          ) : (
            <div className="text-[var(--color-text-secondary)]">
              platform.getCurrentValidators did not answer — no stake figure to show.
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
            { formatStake(v.stakeAmount ?? v.weight) } { CURRENCY }
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
        Connected / Avg Uptime intentionally omitted: platform.getCurrentValidators
        reports connected=null and uptime=0 for every validator on the public RPC
        (the API node does not track peer uptime), so any value here would be
        fabricated. Only chain-sourced, verifiable metrics are shown.
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

      { /* Every network, not just this one */ }
      <NetworkValidators/>

      { /* Stake breakdown */ }
      <StakeBreakdown stats={ stats } isLoading={ isLoading } isKnown={ isKnown }/>

      { /* Active validators table */ }
      <ActiveValidatorsTable validators={ validators } isLoading={ isLoading }/>
    </div>
  );
};

export default React.memo(ValidatorsDashboard);
