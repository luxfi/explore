// Live heads of the P-Chain and the C-Chain. A head that could not be read is
// undefined, never 0: a P-Chain at genesis answers height "0", and that is a
// fact about the chain, not a failed read.

import { useQuery } from '@tanstack/react-query';

import type { GetHeightResponse } from './types';

import { getPChain } from 'configs/app/chainRegistry';
import { getEnvValue } from 'configs/app/utils';

import { read } from './read';

const HEIGHTS_STALE_TIME_MS = 15_000;
const HEIGHTS_QUERY_KEY = 'pchain:chainHeights' as const;

async function fetchChainHeights(): Promise<{ pChain?: number; cChain?: number }> {
  // NEXT_PUBLIC_NETWORK_RPC_URL IS the C-chain EVM RPC endpoint (canonical
  // `/v1/chain/C/rpc` on the gateway). Dial it directly — no path rewriting — so
  // the C-chain height works regardless of the gateway path scheme.
  const cChainRpcUrl = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL') ?? '';

  const [ pRes, cRes ] = await Promise.allSettled([
    read<GetHeightResponse>('height'),
    fetch(cChainRpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 2 }),
    }),
  ]);

  let pChain: number | undefined;
  let cChain: number | undefined;

  if (pRes.status === 'fulfilled' && /^\d+$/.test(pRes.value.height ?? '')) {
    pChain = Number(pRes.value.height);
  }

  if (cRes.status === 'fulfilled' && cRes.value.ok) {
    const data = await cRes.value.json() as { result?: string };
    cChain = data.result ? parseInt(data.result, 16) : undefined;
  }

  return { pChain, cChain };
}

export interface UseChainHeightsResult {
  readonly pChainHeight: number | undefined;
  readonly cChainHeight: number | undefined;
  readonly isLoading: boolean;
}

export function useChainHeights(): UseChainHeightsResult {
  const query = useQuery({
    queryKey: [ HEIGHTS_QUERY_KEY ],
    queryFn: fetchChainHeights,
    staleTime: HEIGHTS_STALE_TIME_MS,
    refetchInterval: HEIGHTS_STALE_TIME_MS,
    enabled: Boolean(getPChain()),
  });

  return {
    pChainHeight: query.data?.pChain,
    cChainHeight: query.data?.cChain,
    isLoading: query.isLoading,
  };
}
