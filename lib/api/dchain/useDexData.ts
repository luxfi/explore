import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type {
  DexOrder,
  DexTrade,
  DexPool,
  DexSymbolStats,
  DexOverviewStats,
} from './types';

import { getDChain } from 'lib/api/luxnet/chains';

const DEX_STALE_TIME_MS = 30_000;
const DEX_QUERY_KEY = 'dchain:dexData' as const;

export interface UseDexDataResult {
  readonly symbols: ReadonlyArray<DexSymbolStats>;
  readonly orders: ReadonlyArray<DexOrder>;
  readonly trades: ReadonlyArray<DexTrade>;
  readonly pools: ReadonlyArray<DexPool>;
  readonly overview: DexOverviewStats;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: Error | null;
}

interface DexDataPayload {
  readonly symbols: ReadonlyArray<DexSymbolStats>;
  readonly orders: ReadonlyArray<DexOrder>;
  readonly trades: ReadonlyArray<DexTrade>;
  readonly pools: ReadonlyArray<DexPool>;
  readonly overview: DexOverviewStats;
}

const EMPTY_SYMBOLS: ReadonlyArray<DexSymbolStats> = [];
const EMPTY_ORDERS: ReadonlyArray<DexOrder> = [];
const EMPTY_TRADES: ReadonlyArray<DexTrade> = [];
const EMPTY_POOLS: ReadonlyArray<DexPool> = [];
const EMPTY_OVERVIEW: DexOverviewStats = {
  totalPairs: 0,
  volume24h: '0',
  activeOrders: 0,
  tradesToday: 0,
};

const EMPTY_PAYLOAD: DexDataPayload = {
  symbols: EMPTY_SYMBOLS,
  orders: EMPTY_ORDERS,
  trades: EMPTY_TRADES,
  pools: EMPTY_POOLS,
  overview: EMPTY_OVERVIEW,
};

// Read DEX state directly from the D-Chain (DexVM) over the luxnet SDK. When the
// D-Chain is not yet serving market data we return an honest-empty payload — the
// UI must never present fabricated markets/orders/trades/pools to users.
async function fetchDexData(): Promise<DexDataPayload> {
  const dchain = getDChain();
  const stats = await dchain.getStats();

  if (!stats || (stats.trades24h ?? 0) <= 0) {
    return EMPTY_PAYLOAD;
  }

  const [ pools, markets ] = await Promise.all([
    dchain.getPools(),
    dchain.getMarkets(),
  ]);

  return {
    // Markets/orders/trades are surfaced once the DexVM indexer exposes them;
    // until then the SDK returns nothing and these stay empty rather than faked.
    symbols: EMPTY_SYMBOLS,
    orders: EMPTY_ORDERS,
    trades: EMPTY_TRADES,
    pools: pools.map((p, i) => ({
      id: `pool-${ i }`,
      tokenA: String(p.tokenA),
      tokenB: String(p.tokenB),
      reserveA: String(p.reserveA),
      reserveB: String(p.reserveB),
      tvl: String(p.totalLiquidity),
      volume24h: '0',
      fee: String(p.fee),
    })),
    overview: {
      totalPairs: markets.length,
      volume24h: stats.volume24h ?? '0',
      activeOrders: 0,
      tradesToday: stats.trades24h ?? 0,
    },
  };
}

export function useDexData(): UseDexDataResult {
  const query = useQuery({
    queryKey: [ DEX_QUERY_KEY ],
    queryFn: fetchDexData,
    staleTime: DEX_STALE_TIME_MS,
    retry: 1,
  });

  const symbols = React.useMemo(
    () => query.data?.symbols ?? EMPTY_SYMBOLS,
    [ query.data?.symbols ],
  );

  const orders = React.useMemo(
    () => query.data?.orders ?? EMPTY_ORDERS,
    [ query.data?.orders ],
  );

  const trades = React.useMemo(
    () => query.data?.trades ?? EMPTY_TRADES,
    [ query.data?.trades ],
  );

  const pools = React.useMemo(
    () => query.data?.pools ?? EMPTY_POOLS,
    [ query.data?.pools ],
  );

  const overview = React.useMemo(
    () => query.data?.overview ?? EMPTY_OVERVIEW,
    [ query.data?.overview ],
  );

  return {
    symbols,
    orders,
    trades,
    pools,
    overview,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
