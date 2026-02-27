// React Query hook for platform.getBlockchains.
// Returns the list of all blockchains registered on the P-chain.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { PChainBlockchain } from './types';

import { getPChain } from './client';

const BLOCKCHAINS_STALE_TIME_MS = 300_000;
const BLOCKCHAINS_QUERY_KEY = 'pchain:blockchains' as const;
const EMPTY_BLOCKCHAINS: ReadonlyArray<PChainBlockchain> = [];

async function fetchBlockchains(): Promise<ReadonlyArray<PChainBlockchain>> {
  const blockchains = await getPChain().getBlockchains();
  return blockchains as unknown as ReadonlyArray<PChainBlockchain>;
}

export function useBlockchains() {
  const query = useQuery({
    queryKey: [ BLOCKCHAINS_QUERY_KEY ],
    queryFn: fetchBlockchains,
    staleTime: BLOCKCHAINS_STALE_TIME_MS,
  });

  const blockchains = React.useMemo(
    () => query.data ?? EMPTY_BLOCKCHAINS,
    [ query.data ],
  );

  return {
    blockchains,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
