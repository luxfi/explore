import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { BridgeOverviewStats } from './types';

import { getBChain } from 'lib/api/luxnet/chains';

const BRIDGE_STALE_TIME_MS = 60_000;
const BRIDGE_QUERY_KEY = 'bchain:bridgeData' as const;

const EMPTY_STATS: BridgeOverviewStats = {
  signerCount: 0,
  threshold: 0,
  epoch: 0,
  waitlistSize: 0,
};

async function fetchBridgeData(): Promise<BridgeOverviewStats> {
  try {
    const bchain = getBChain();
    const [ signerSet, waitlist ] = await Promise.all([
      bchain.getSignerSetInfo(),
      bchain.getWaitlist(),
    ]);

    return {
      signerCount: signerSet.totalSigners ?? signerSet.signers?.length ?? 0,
      threshold: signerSet.threshold ?? 0,
      epoch: signerSet.epoch ?? 0,
      waitlistSize: waitlist?.length ?? 0,
    };
  } catch { /* B-Chain RPC unavailable */ }

  return EMPTY_STATS;
}

export interface UseBridgeDataResult {
  readonly stats: BridgeOverviewStats;
  readonly isLoading: boolean;
}

export function useBridgeData(): UseBridgeDataResult {
  const query = useQuery({
    queryKey: [ BRIDGE_QUERY_KEY ],
    queryFn: fetchBridgeData,
    staleTime: BRIDGE_STALE_TIME_MS,
  });

  const stats = React.useMemo(
    () => query.data ?? EMPTY_STATS,
    [ query.data ],
  );

  return {
    stats,
    isLoading: query.isLoading,
  };
}
