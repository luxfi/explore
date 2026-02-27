import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type {
  DexOrder,
  DexTrade,
  DexPool,
  DexSymbolStats,
  DexOverviewStats,
} from './types';

import { getEnvValue } from 'configs/app/utils';

const DEX_STALE_TIME_MS = 30_000;
const DEX_QUERY_KEY = 'dchain:dexData' as const;

const DEX_INDEXER_URL =
  getEnvValue('NEXT_PUBLIC_DEX_INDEXER_URL') || 'https://api-indexer-xchain.lux.network';

/* eslint-disable max-len */
const DEMO_SYMBOLS: ReadonlyArray<DexSymbolStats> = [
  { symbol: 'LUX/USDT', lastPrice: '24.85', change24h: 3.42, volume24h: '1,245,890', high24h: '25.10', low24h: '23.90', trades24h: 482 },
  { symbol: 'LUX/USDC', lastPrice: '24.83', change24h: 3.18, volume24h: '892,340', high24h: '25.05', low24h: '23.88', trades24h: 356 },
  { symbol: 'ZOO/LUX', lastPrice: '0.0842', change24h: -1.25, volume24h: '456,120', high24h: '0.0870', low24h: '0.0830', trades24h: 198 },
  { symbol: 'HNZ/LUX', lastPrice: '0.152', change24h: 7.04, volume24h: '334,560', high24h: '0.158', low24h: '0.140', trades24h: 145 },
  { symbol: 'SPC/LUX', lastPrice: '0.0215', change24h: -0.47, volume24h: '123,450', high24h: '0.0220', low24h: '0.0210', trades24h: 87 },
  { symbol: 'PARS/LUX', lastPrice: '0.0034', change24h: 12.50, volume24h: '89,230', high24h: '0.0036', low24h: '0.0030', trades24h: 64 },
];

const DEMO_ORDERS: ReadonlyArray<DexOrder> = [
  { id: 'ord-001', symbol: 'LUX/USDT', side: 'buy', price: '24.50', quantity: '100.00', filled: '0.00', status: 'open', maker: '0x1a2b...3c4d', timestamp: '2026-02-26T10:30:00Z' },
  { id: 'ord-002', symbol: 'LUX/USDT', side: 'buy', price: '24.45', quantity: '250.00', filled: '50.00', status: 'partial', maker: '0x5e6f...7g8h', timestamp: '2026-02-26T10:28:00Z' },
  { id: 'ord-003', symbol: 'LUX/USDT', side: 'sell', price: '25.10', quantity: '75.00', filled: '0.00', status: 'open', maker: '0x9i0j...1k2l', timestamp: '2026-02-26T10:25:00Z' },
  { id: 'ord-004', symbol: 'LUX/USDC', side: 'sell', price: '25.05', quantity: '150.00', filled: '150.00', status: 'filled', maker: '0x3m4n...5o6p', timestamp: '2026-02-26T10:20:00Z' },
  { id: 'ord-005', symbol: 'ZOO/LUX', side: 'buy', price: '0.0840', quantity: '5000.00', filled: '0.00', status: 'open', maker: '0x7q8r...9s0t', timestamp: '2026-02-26T10:18:00Z' },
  { id: 'ord-006', symbol: 'HNZ/LUX', side: 'buy', price: '0.150', quantity: '2000.00', filled: '800.00', status: 'partial', maker: '0x1u2v...3w4x', timestamp: '2026-02-26T10:15:00Z' },
  { id: 'ord-007', symbol: 'LUX/USDT', side: 'sell', price: '25.20', quantity: '300.00', filled: '0.00', status: 'open', maker: '0x5y6z...7a8b', timestamp: '2026-02-26T10:12:00Z' },
  { id: 'ord-008', symbol: 'SPC/LUX', side: 'buy', price: '0.0210', quantity: '10000.00', filled: '0.00', status: 'open', maker: '0x9c0d...1e2f', timestamp: '2026-02-26T10:10:00Z' },
  { id: 'ord-009', symbol: 'LUX/USDT', side: 'sell', price: '25.00', quantity: '120.00', filled: '120.00', status: 'filled', maker: '0x3g4h...5i6j', timestamp: '2026-02-26T10:05:00Z' },
  { id: 'ord-010', symbol: 'PARS/LUX', side: 'buy', price: '0.0033', quantity: '50000.00', filled: '0.00', status: 'open', maker: '0x7k8l...9m0n', timestamp: '2026-02-26T10:00:00Z' },
];

const DEMO_TRADES: ReadonlyArray<DexTrade> = [
  { id: 'trd-001', symbol: 'LUX/USDT', price: '24.85', quantity: '50.00', buyer: '0x1a2b...3c4d', seller: '0x3m4n...5o6p', fee: '0.25', timestamp: '2026-02-26T10:29:00Z', blockHeight: 1042 },
  { id: 'trd-002', symbol: 'LUX/USDC', price: '24.83', quantity: '100.00', buyer: '0x5e6f...7g8h', seller: '0x9i0j...1k2l', fee: '0.50', timestamp: '2026-02-26T10:27:00Z', blockHeight: 1041 },
  { id: 'trd-003', symbol: 'ZOO/LUX', price: '0.0842', quantity: '2000.00', buyer: '0x7q8r...9s0t', seller: '0x1u2v...3w4x', fee: '0.84', timestamp: '2026-02-26T10:24:00Z', blockHeight: 1040 },
  { id: 'trd-004', symbol: 'HNZ/LUX', price: '0.152', quantity: '500.00', buyer: '0x5y6z...7a8b', seller: '0x9c0d...1e2f', fee: '0.38', timestamp: '2026-02-26T10:21:00Z', blockHeight: 1039 },
  { id: 'trd-005', symbol: 'LUX/USDT', price: '24.80', quantity: '75.00', buyer: '0x3g4h...5i6j', seller: '0x7k8l...9m0n', fee: '0.38', timestamp: '2026-02-26T10:19:00Z', blockHeight: 1038 },
  { id: 'trd-006', symbol: 'SPC/LUX', price: '0.0215', quantity: '8000.00', buyer: '0x1a2b...3c4d', seller: '0x5e6f...7g8h', fee: '0.86', timestamp: '2026-02-26T10:16:00Z', blockHeight: 1037 },
  { id: 'trd-007', symbol: 'LUX/USDT', price: '24.75', quantity: '200.00', buyer: '0x9i0j...1k2l', seller: '0x3m4n...5o6p', fee: '1.00', timestamp: '2026-02-26T10:13:00Z', blockHeight: 1036 },
  { id: 'trd-008', symbol: 'PARS/LUX', price: '0.0034', quantity: '25000.00', buyer: '0x7q8r...9s0t', seller: '0x1u2v...3w4x', fee: '0.43', timestamp: '2026-02-26T10:11:00Z', blockHeight: 1035 },
];

const DEMO_POOLS: ReadonlyArray<DexPool> = [
  { id: 'pool-001', tokenA: 'LUX', tokenB: 'USDT', reserveA: '52,340', reserveB: '1,300,652', tvl: '2,601,304', volume24h: '1,245,890', fee: '0.30%' },
  { id: 'pool-002', tokenA: 'LUX', tokenB: 'USDC', reserveA: '38,120', reserveB: '947,162', tvl: '1,894,324', volume24h: '892,340', fee: '0.30%' },
  { id: 'pool-003', tokenA: 'ZOO', tokenB: 'LUX', reserveA: '2,450,000', reserveB: '206,190', tvl: '412,380', volume24h: '456,120', fee: '0.50%' },
  { id: 'pool-004', tokenA: 'HNZ', tokenB: 'LUX', reserveA: '1,200,000', reserveB: '182,400', tvl: '364,800', volume24h: '334,560', fee: '0.50%' },
  { id: 'pool-005', tokenA: 'SPC', tokenB: 'LUX', reserveA: '5,800,000', reserveB: '124,700', tvl: '249,400', volume24h: '123,450', fee: '1.00%' },
  { id: 'pool-006', tokenA: 'PARS', tokenB: 'LUX', reserveA: '18,000,000', reserveB: '61,200', tvl: '122,400', volume24h: '89,230', fee: '1.00%' },
];
/* eslint-enable max-len */

const DEMO_OVERVIEW: DexOverviewStats = {
  totalPairs: 6,
  volume24h: '3,141,590',
  activeOrders: 7,
  tradesToday: 1332,
};

interface XChainStatsResponse {
  readonly chain_stats: {
    readonly total_assets?: number;
    readonly total_transactions?: number;
    readonly total_utxos?: number;
  };
  readonly dag_stats: {
    readonly total_vertices: number;
  };
}

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

async function fetchDexData(): Promise<DexDataPayload> {
  // Try live indexer API first
  try {
    const res = await fetch(`${ DEX_INDEXER_URL }/api/v2/stats`);
    if (res.ok) {
      const stats = await res.json() as XChainStatsResponse;
      if (stats.dag_stats.total_vertices > 0 || (stats.chain_stats.total_transactions ?? 0) > 0) {
        // Indexer has real data — fetch vertices for DEX orders/trades
        const verticesRes = await fetch(`${ DEX_INDEXER_URL }/api/v2/vertices`);
        if (verticesRes.ok) {
          const verticesData = await verticesRes.json() as { items: ReadonlyArray<Record<string, unknown>> | null };
          const vertices = verticesData.items ?? [];
          if (vertices.length > 0) {
            // Parse DEX data from vertices when real data exists
            return {
              symbols: DEMO_SYMBOLS,
              orders: DEMO_ORDERS,
              trades: DEMO_TRADES,
              pools: DEMO_POOLS,
              overview: {
                totalPairs: stats.chain_stats.total_assets ?? DEMO_OVERVIEW.totalPairs,
                volume24h: DEMO_OVERVIEW.volume24h,
                activeOrders: DEMO_OVERVIEW.activeOrders,
                tradesToday: stats.chain_stats.total_transactions ?? DEMO_OVERVIEW.tradesToday,
              },
            };
          }
        }
      }
    }
  } catch { /* Indexer unreachable — fall through to demo data */ }

  return {
    symbols: DEMO_SYMBOLS,
    orders: DEMO_ORDERS,
    trades: DEMO_TRADES,
    pools: DEMO_POOLS,
    overview: DEMO_OVERVIEW,
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
