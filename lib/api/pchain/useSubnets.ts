// React Query hook for platform.getSubnets.
// Returns the list of all subnets on the P-chain.
// Uses the server-side /api/pchain proxy to bypass CORS.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { PChainSubnet } from './types';

const SUBNETS_STALE_TIME_MS = 300_000;
const SUBNETS_QUERY_KEY = 'pchain:subnets' as const;
const EMPTY_SUBNETS: ReadonlyArray<PChainSubnet> = [];

async function fetchSubnets(): Promise<ReadonlyArray<PChainSubnet>> {
  const res = await fetch('/api/pchain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'platform.getSubnets',
      params: {},
      id: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`P-chain proxy returned ${ res.status }`);
  }

  const json = await res.json() as { result?: { subnets?: ReadonlyArray<PChainSubnet> } };
  return json.result?.subnets ?? [];
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
