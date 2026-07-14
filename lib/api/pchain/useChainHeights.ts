// React Query hook for fetching live block heights for P-chain and C-chain.

import { useQuery } from '@tanstack/react-query';

import { getEnvValue } from 'configs/app/utils';

const HEIGHTS_STALE_TIME_MS = 15_000;
const HEIGHTS_QUERY_KEY = 'pchain:chainHeights' as const;

async function fetchChainHeights(): Promise<{ pChain: number; cChain: number }> {
  // NEXT_PUBLIC_NETWORK_RPC_URL IS the C-chain EVM RPC endpoint (canonical
  // `/v1/bc/C/rpc` on the gateway). Dial it directly — no path rewriting — so
  // the C-chain height works regardless of the gateway path scheme.
  const cChainRpcUrl = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL') ?? '';

  const [ pRes, cRes ] = await Promise.allSettled([
    // P-chain: use server-side proxy to bypass CORS
    fetch('/api/pchain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'platform.getHeight', params: {}, id: 1 }),
    }),
    fetch(cChainRpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 2 }),
    }),
  ]);

  let pChain = 0;
  let cChain = 0;

  if (pRes.status === 'fulfilled' && pRes.value.ok) {
    const data = await pRes.value.json() as { result?: { height?: string } };
    pChain = data.result?.height ? parseInt(data.result.height, 10) : 0;
  }

  if (cRes.status === 'fulfilled' && cRes.value.ok) {
    const data = await cRes.value.json() as { result?: string };
    cChain = data.result ? parseInt(data.result, 16) : 0;
  }

  return { pChain, cChain };
}

export interface UseChainHeightsResult {
  readonly pChainHeight: number;
  readonly cChainHeight: number;
  readonly isLoading: boolean;
}

export function useChainHeights(): UseChainHeightsResult {
  const query = useQuery({
    queryKey: [ HEIGHTS_QUERY_KEY ],
    queryFn: fetchChainHeights,
    staleTime: HEIGHTS_STALE_TIME_MS,
    refetchInterval: HEIGHTS_STALE_TIME_MS,
  });

  return {
    pChainHeight: query.data?.pChain ?? 0,
    cChainHeight: query.data?.cChain ?? 0,
    isLoading: query.isLoading,
  };
}
