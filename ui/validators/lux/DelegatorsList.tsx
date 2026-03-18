import React from 'react';

import type { PChainDelegator, PChainValidator } from 'lib/api/pchain';
import dayjs from 'lib/date/dayjs';
import { Skeleton } from 'toolkit/chakra/skeleton';

import { formatStake, truncateNodeId } from './utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FlatDelegator extends PChainDelegator {
  readonly validatorNodeID: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TXID_PREFIX_LEN = 10;
const TXID_SUFFIX_LEN = 6;

function truncateTxId(txId: string): string {
  const minLength = TXID_PREFIX_LEN + TXID_SUFFIX_LEN + 3;
  if (txId.length <= minLength) {
    return txId;
  }
  return `${ txId.slice(0, TXID_PREFIX_LEN) }...${ txId.slice(-TXID_SUFFIX_LEN) }`;
}

function formatTimestamp(unixSeconds: string): string {
  const ts = Number(unixSeconds);
  if (ts === 0) {
    return '\u2014';
  }
  return dayjs.unix(ts).format('lll');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface DelegatorsListProps {
  readonly validators: ReadonlyArray<PChainValidator>;
  readonly isLoading: boolean;
}

const DelegatorsList = ({ validators, isLoading }: DelegatorsListProps) => {
  const delegators = React.useMemo<ReadonlyArray<FlatDelegator>>(() => {
    const result: Array<FlatDelegator> = [];
    for (const v of validators) {
      if (v.delegators) {
        for (const d of v.delegators) {
          result.push({ ...d, validatorNodeID: v.nodeID });
        }
      }
    }
    // Sort by stake descending
    result.sort((a, b) => {
      const aStake = BigInt(a.stakeAmount);
      const bStake = BigInt(b.stakeAmount);
      if (bStake > aStake) return 1;
      if (bStake < aStake) return -1;
      return 0;
    });
    return result;
  }, [ validators ]);

  return (
    <div
      className="overflow-hidden"
    >
      { /* Header */ }
      <div className="flex">
        <div className="font-semibold">
          TX ID
        </div>
        <div className="font-semibold">
          Node ID
        </div>
        <div className="font-semibold">
          Stake Amount
        </div>
        <div className="font-semibold">
          Start
        </div>
        <div className="font-semibold">
          End
        </div>
        <div className="font-semibold">
          Potential Reward
        </div>
      </div>

      { /* Loading */ }
      { isLoading && (
        <div>
          <Skeleton loading/>
          <Skeleton loading/>
          <Skeleton loading/>
        </div>
      ) }

      { /* Empty state */ }
      { !isLoading && delegators.length === 0 && (
        <div>
          No delegators found
        </div>
      ) }

      { /* Rows */ }
      { !isLoading && delegators.map((d) => (
        <div className="flex" key={ `${ d.txID }-${ d.validatorNodeID }` }>
          <div
            title={ d.txID }
            className="overflow-hidden"
          >
            { truncateTxId(d.txID) }
          </div>
          <div
            title={ d.validatorNodeID }
            className="overflow-hidden"
          >
            { truncateNodeId(d.validatorNodeID) }
          </div>
          <div className="text-left lg:text-right">
            { formatStake(d.stakeAmount) } LUX
          </div>
          <div>
            { formatTimestamp(d.startTime) }
          </div>
          <div>
            { formatTimestamp(d.endTime) }
          </div>
          <div className="text-left lg:text-right">
            { formatStake(d.potentialReward) } LUX
          </div>
        </div>
      )) }
    </div>
  );
};

export default React.memo(DelegatorsList);
