// React Query hook for platform.getNets.
// Returns the list of all networks registered on the P-chain. Lux nomenclature:
// a sovereign L1 is a Network. The node's only wire method is
// `platform.getNets` (vms/platformvm/service.go: GetNets/APINet) — the legacy
// upstream method name does not exist here and returns JSON-RPC -32000.
// Uses the server-side /v1/node/p-chain proxy to bypass CORS.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { PChainNet } from './types';

const NETS_STALE_TIME_MS = 300_000;
const NETS_QUERY_KEY = 'pchain:nets' as const;
const EMPTY_NETS: ReadonlyArray<PChainNet> = [];

async function fetchNets(): Promise<ReadonlyArray<PChainNet>> {
  const res = await fetch('/v1/node/p-chain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'platform.getNets',
      params: {},
      id: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`P-chain proxy returned ${ res.status }`);
  }

  const json = await res.json() as { result?: { nets?: ReadonlyArray<PChainNet> } };
  return json.result?.nets ?? [];
}

export function useNets() {
  const query = useQuery({
    queryKey: [ NETS_QUERY_KEY ],
    queryFn: fetchNets,
    staleTime: NETS_STALE_TIME_MS,
  });

  const nets = React.useMemo(
    () => query.data ?? EMPTY_NETS,
    [ query.data ],
  );

  return {
    nets,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
