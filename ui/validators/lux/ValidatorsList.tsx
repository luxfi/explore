import React from 'react';

import type { PChainValidator } from 'lib/api/pchain';
import { Input } from '@luxfi/ui/input';
import { Skeleton } from '@luxfi/ui/skeleton';

import { formatStake, formatUptime, truncateNodeId } from './utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ValidatorsListProps {
  readonly validators: ReadonlyArray<PChainValidator>;
  readonly isLoading: boolean;
}

const ValidatorsList = ({ validators, isLoading }: ValidatorsListProps) => {
  const [ search, setSearch ] = React.useState('');

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [],
  );

  // Sort by stake desc, then filter by search
  const filtered = React.useMemo(() => {
    const sorted = [ ...validators ].sort((a, b) => {
      const aStake = BigInt(a.stakeAmount ?? a.weight);
      const bStake = BigInt(b.stakeAmount ?? b.weight);
      if (bStake > aStake) return 1;
      if (bStake < aStake) return -1;
      return 0;
    });

    if (!search.trim()) {
      return sorted;
    }

    const term = search.trim().toLowerCase();
    return sorted.filter((v) => v.nodeID.toLowerCase().includes(term));
  }, [ validators, search ]);

  return (
    <div className="flex flex-col gap-4">
      { /* Search */ }
      <div>
        <Input
          placeholder="Search by Node ID..."
          value={ search }
          onChange={ handleSearchChange }
          size="md"
        />
      </div>

      { /* Table */ }
      <div
        className="overflow-hidden"
      >
        { /* Header */ }
        <div className="flex gap-4 py-2 border-b border-[var(--color-border-divider)]">
          <div className="font-semibold flex-[3] min-w-0">
            Node ID
          </div>
          <div className="font-semibold flex-[2] text-right">
            Stake Amount
          </div>
          <div className="font-semibold flex-1 text-right">
            Delegation Fee
          </div>
          <div className="font-semibold flex-1 text-right">
            Delegators
          </div>
          <div className="font-semibold flex-1 text-center">
            Connected
          </div>
          <div className="font-semibold flex-1 text-right">
            Uptime
          </div>
        </div>

        { /* Loading */ }
        { isLoading && (
          <div>
            <Skeleton loading/>
            <Skeleton loading/>
            <Skeleton loading/>
            <Skeleton loading/>
          </div>
        ) }

        { /* Empty state */ }
        { !isLoading && filtered.length === 0 && (
          <div>
            { search.trim() ? 'No validators match your search' : 'No validators found' }
          </div>
        ) }

        { /* Rows */ }
        { !isLoading && filtered.map((v) => (
          <div className="flex gap-4 py-1.5 border-b border-[var(--color-border-divider)]" key={ v.nodeID }>
            <div
              title={ v.nodeID }
              className="flex-[3] min-w-0 overflow-hidden text-ellipsis font-mono"
            >
              { truncateNodeId(v.nodeID) }
            </div>
            <div className="flex-[2] text-right font-mono">
              { formatStake(v.stakeAmount ?? v.weight) } LUX
            </div>
            <div className="flex-1 text-right font-mono">
              { v.delegationFee }%
            </div>
            <div className="flex-1 text-right font-mono">
              { v.delegators?.length ?? 0 }
            </div>
            <div className="flex-1 flex justify-center">
              <div/>
            </div>
            <div className="flex-1 text-right font-mono">
              { formatUptime(v.uptime) }
            </div>
          </div>
        )) }
      </div>
    </div>
  );
};

export default React.memo(ValidatorsList);
