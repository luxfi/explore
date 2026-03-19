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
  readonly hasData: boolean;
}

interface DexDataPayload {
  readonly symbols: ReadonlyArray<DexSymbolStats>;
  readonly orders: ReadonlyArray<DexOrder>;
  readonly trades: ReadonlyArray<DexTrade>;
  readonly pools: ReadonlyArray<DexPool>;
  readonly overview: DexOverviewStats;
  readonly hasData: boolean;
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

async function fetchDexData(): Promise<DexDataPayload> {
  // Try luxnet SDK D-Chain RPC
  try {
    const dchain = getDChain();
    const stats = await dchain.getStats();

    if (stats && stats.trades24h > 0) {
      const [ pools, markets ] = await Promise.all([
        dchain.getPools(),
        dchain.getMarkets(),
      ]);

      return {
        symbols: markets.map((m) => ({
          symbol: String(m.symbol ?? ''),
          lastPrice: String(m.lastPrice ?? '0'),
          change24h: Number(m.change24h ?? 0),
          volume24h: String(m.volume24h ?? '0'),
          high24h: String(m.high24h ?? '0'),
          low24h: String(m.low24h ?? '0'),
          trades24h: Number(m.trades24h ?? 0),
        })),
        orders: [],
        trades: [],
        pools: pools.map((p, i) => ({
          id: `pool-${ i }`,
          tokenA: String(p.tokenA ?? ''),
          tokenB: String(p.tokenB ?? ''),
          reserveA: String(p.reserveA ?? '0'),
          reserveB: String(p.reserveB ?? '0'),
          tvl: String(p.totalLiquidity ?? '0'),
          volume24h: String((p as Record<string, unknown>).volume24h ?? '0'),
          fee: String(p.fee ?? '0'),
        })),
        overview: {
          totalPairs: markets.length,
          volume24h: stats.volume24h || '0',
          activeOrders: 0,
          tradesToday: stats.trades24h,
        },
        hasData: true,
      };
    }
  } catch { /* D-Chain RPC unavailable */ }

  return {
    symbols: EMPTY_SYMBOLS,
    orders: EMPTY_ORDERS,
    trades: EMPTY_TRADES,
    pools: EMPTY_POOLS,
    overview: EMPTY_OVERVIEW,
    hasData: false,
  };
}

export function useDexData(): UseDexDataResult {
  const query = useQuery({
    queryKey: [ DEX_QUERY_KEY ],
    queryFn: fetchDexData,
    staleTime: DEX_STALE_TIME_MS,
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

  const hasData = query.data?.hasData ?? false;

  return {
    symbols,
    orders,
    trades,
    pools,
    overview,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    hasData,
  };
}
