// React Query hook for platform.getBlockchains.
// Returns the list of all blockchains registered on the P-chain.
// Uses the server-side /api/pchain proxy to bypass CORS.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { PChainBlockchain } from './types';

const BLOCKCHAINS_STALE_TIME_MS = 300_000;
const BLOCKCHAINS_QUERY_KEY = 'pchain:blockchains' as const;
const EMPTY_BLOCKCHAINS: ReadonlyArray<PChainBlockchain> = [];

async function fetchBlockchains(): Promise<ReadonlyArray<PChainBlockchain>> {
  const res = await fetch('/api/pchain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'platform.getBlockchains',
      params: {},
      id: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`P-chain proxy returned ${ res.status }`);
  }

  const json = await res.json() as { result?: { blockchains?: ReadonlyArray<PChainBlockchain> } };
  return json.result?.blockchains ?? [];
}

export function useBlockchains({ enabled = true }: { enabled?: boolean } = {}) {
  const query = useQuery({
    queryKey: [ BLOCKCHAINS_QUERY_KEY ],
    queryFn: fetchBlockchains,
    staleTime: BLOCKCHAINS_STALE_TIME_MS,
    retry: 2,
    enabled,
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
