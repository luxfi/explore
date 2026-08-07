import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AmmFactory, AmmOverview, AmmSwap, AmmSwapView } from './types';

import { getApiBase, fetchSubgraph } from 'lib/api/subgraph';
import { useHeadBlock } from 'lib/api/useHeadBlock';
import type { VenueStatus } from 'lib/api/venueStatus';
import { deriveVenueStatus } from 'lib/api/venueStatus';

// One root field per request — the subgraph engine processes a single root
// field per query, so swaps and factory totals are fetched separately.
const SWAPS_QUERY = '{ swaps(first:50, orderBy: timestamp, orderDirection: desc) ' +
  '{ id timestamp amount0 amount1 sender pool { id feeTier token0 { id symbol decimals } token1 { id symbol decimals } } } }';
const FACTORY_QUERY = '{ factories { id poolCount totalValueLockedUSD totalVolumeUSD } }';

const AMM_GRAPHQL_PATH = '/v1/graph/cchain/amm/graphql';
const POLL_INTERVAL_MS = 30_000;
const AMOUNT_ACCURACY = 4;

// Absolute value of a signed subgraph amount, scaled by its own token's
// decimals. The sign only encodes direction, which the caller has already read.
function formatAmount(raw: string, decimals: number): string {
  const value = BigNumber(raw).abs().div(BigNumber(10).pow(decimals));
  return value.isNaN() ? '0' : value.dp(AMOUNT_ACCURACY).toFormat();
}

// Pure: turn pool-signed amounts into the trade a person made.
export function buildSwapViews(swaps: ReadonlyArray<AmmSwap>): ReadonlyArray<AmmSwapView> {
  return swaps.map((swap) => {
    const { token0, token1, feeTier } = swap.pool;
    // Positive amount0 means the pool received token0, so the trader sold it.
    const soldIsToken0 = !swap.amount0.startsWith('-');
    const sold = soldIsToken0 ? token0 : token1;
    const bought = soldIsToken0 ? token1 : token0;

    return {
      id: swap.id,
      // The subgraph keys a swap as `<txHash>#<logIndex>`.
      txHash: swap.id.split('#')[0],
      block: swap.timestamp,
      sender: swap.sender,
      pair: `${ token0.symbol }/${ token1.symbol }`,
      feeTier,
      soldSymbol: sold.symbol,
      soldAmount: formatAmount(soldIsToken0 ? swap.amount0 : swap.amount1, sold.decimals),
      boughtSymbol: bought.symbol,
      boughtAmount: formatAmount(soldIsToken0 ? swap.amount1 : swap.amount0, bought.decimals),
    };
  });
}

// Pure: headline figures, all read off the indexer rather than inferred.
export function computeAmmOverview(
  factory: AmmFactory | null,
  swaps: ReadonlyArray<AmmSwap>,
): AmmOverview {
  return {
    poolCount: factory?.poolCount ?? 0,
    tvlUsd: factory?.totalValueLockedUSD ?? '0',
    volumeUsd: factory?.totalVolumeUSD ?? '0',
    latestBlock: swaps.length > 0 ? Math.max(...swaps.map((swap) => swap.timestamp)) : null,
  };
}

async function fetchSwaps(): Promise<ReadonlyArray<AmmSwap> | null> {
  const data = await fetchSubgraph<{ swaps: ReadonlyArray<AmmSwap> | null }>(AMM_GRAPHQL_PATH, SWAPS_QUERY);
  return data ? data.swaps ?? [] : null;
}

async function fetchFactory(): Promise<AmmFactory | null> {
  const data = await fetchSubgraph<{ factories: ReadonlyArray<AmmFactory> | null }>(AMM_GRAPHQL_PATH, FACTORY_QUERY);
  return data?.factories?.[0] ?? null;
}

export interface UseAmmDataResult {
  readonly swaps: ReadonlyArray<AmmSwapView>;
  readonly overview: AmmOverview;
  readonly status: VenueStatus;
  readonly isLoading: boolean;
}

export function useAmmData(): UseAmmDataResult {
  const swapsQuery = useQuery({
    queryKey: [ 'amm:swaps', getApiBase() ],
    queryFn: fetchSwaps,
    refetchInterval: POLL_INTERVAL_MS,
  });

  const factoryQuery = useQuery({
    queryKey: [ 'amm:factory', getApiBase() ],
    queryFn: fetchFactory,
    refetchInterval: POLL_INTERVAL_MS,
  });

  const headBlock = useHeadBlock();

  const rawSwaps = swapsQuery.data ?? null;
  const overview = React.useMemo(
    () => computeAmmOverview(factoryQuery.data ?? null, rawSwaps ?? []),
    [ factoryQuery.data, rawSwaps ],
  );
  const swaps = React.useMemo(() => buildSwapViews(rawSwaps ?? []), [ rawSwaps ]);

  return {
    swaps,
    overview,
    status: deriveVenueStatus(overview.latestBlock, headBlock, rawSwaps !== null),
    isLoading: swapsQuery.isLoading || factoryQuery.isLoading,
  };
}
