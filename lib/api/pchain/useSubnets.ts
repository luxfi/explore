// React Query hook for platform.getSubnets.
// Returns the list of all subnets on the P-chain.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { PChainSubnet } from './types';

import { getPChain } from './client';

const SUBNETS_STALE_TIME_MS = 300_000;
const SUBNETS_QUERY_KEY = 'pchain:subnets' as const;
const EMPTY_SUBNETS: ReadonlyArray<PChainSubnet> = [];

async function fetchSubnets(): Promise<ReadonlyArray<PChainSubnet>> {
  const subnets = await getPChain().getSubnets();
  return subnets as unknown as ReadonlyArray<PChainSubnet>;
}

export function useSubnets() {
  const query = useQuery({
    queryKey: [ SUBNETS_QUERY_KEY ],
    queryFn: fetchSubnets,
    staleTime: SUBNETS_STALE_TIME_MS,
  });

  const subnets = React.useMemo(
    () => query.data ?? EMPTY_SUBNETS,
    [ query.data ],
  );

  return {
    subnets,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
