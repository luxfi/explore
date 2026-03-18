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
        <div className="flex">
          <div className="font-semibold">
            Node ID
          </div>
          <div className="font-semibold">
            Stake Amount
          </div>
          <div className="font-semibold">
            Delegation Fee
          </div>
          <div className="font-semibold">
            Delegators
          </div>
          <div className="font-semibold">
            Connected
          </div>
          <div className="font-semibold">
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
            <div className="text-left lg:text-right">
              { v.delegators?.length ?? 0 }
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
    </div>
  );
};

export default React.memo(ValidatorsList);
