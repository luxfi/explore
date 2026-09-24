// Every blockchain registered on the P-Chain: GET /v1/chain/P/ops/blockchains.

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { GetBlockchainsResponse, PChainBlockchain } from './types';

import { getPChain } from 'configs/app/chainRegistry';

import { read } from './read';

const BLOCKCHAINS_STALE_TIME_MS = 300_000;
const BLOCKCHAINS_QUERY_KEY = 'pchain:blockchains' as const;
const EMPTY_BLOCKCHAINS: ReadonlyArray<PChainBlockchain> = [];

async function fetchBlockchains(): Promise<ReadonlyArray<PChainBlockchain>> {
  return (await read<GetBlockchainsResponse>('blockchains')).blockchains ?? [];
}

export function useBlockchains() {
  const query = useQuery({
    queryKey: [ BLOCKCHAINS_QUERY_KEY ],
    queryFn: fetchBlockchains,
    staleTime: BLOCKCHAINS_STALE_TIME_MS,
    retry: 2,
    enabled: Boolean(getPChain()),
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
