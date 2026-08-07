import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { DexMarket, DexFill, DexMarketView, DexOverview } from './types';

import { getApiBase, fetchSubgraph } from 'lib/api/subgraph';
import { useHeadBlock } from 'lib/api/useHeadBlock';
import type { VenueStatus } from 'lib/api/venueStatus';
import { deriveVenueStatus } from 'lib/api/venueStatus';
import shortenString from 'lib/shortenString';

// One root field per request — the subgraph engine processes a single root
// field per query, so markets and fills are fetched separately.
const MARKETS_QUERY = '{ markets { id symbol baseToken quoteToken feeTier volume24h tradeCount lastPrice lastUpdate } }';
const FILLS_QUERY = '{ fills(first:25) { id market taker amountOut timestamp txHash } }';

const DEX_GRAPHQL_PATH = '/v1/graph/cchain/dex/graphql';
const DEX_STALE_TIME_MS = 30_000;

const EMPTY_MARKETS: ReadonlyArray<DexMarketView> = [];
const EMPTY_FILLS: ReadonlyArray<DexFill> = [];

async function fetchTokenSymbol(address: string): Promise<string | null> {
  const base = getApiBase();
  if (!base) {
    return null;
  }

  try {
    const res = await fetch(`${ base }/tokens/${ address }`);
    if (!res.ok) {
      return null;
    }
    const json = await res.json().catch(() => null) as { symbol?: string | null } | null;
    return json?.symbol || null;
  } catch {
    return null;
  }
}

function tokenLabel(address: string, symbols: ReadonlyMap<string, string>): string {
  return symbols.get(address.toLowerCase()) || shortenString(address, 10);
}

// Pure: attach a human pair label to each market from a resolved symbol map.
export function buildMarketViews(
  markets: ReadonlyArray<DexMarket>,
  symbols: ReadonlyMap<string, string>,
): ReadonlyArray<DexMarketView> {
  return markets.map((m) => ({
    ...m,
    // Prefer the subgraph's bound BASE/QUOTE symbol (the indexer derives it from
    // both currencies' ERC-20 symbols — one pair, one source of truth). Fall back
    // to live token-metadata resolution, then to short addresses.
    pair: m.symbol && m.symbol.includes('/') ?
      m.symbol :
      `${ tokenLabel(m.baseToken, symbols) }/${ tokenLabel(m.quoteToken, symbols) }`,
  }));
}

// Pure: headline aggregates over the live market set.
export function computeOverview(markets: ReadonlyArray<DexMarketView>): DexOverview {
  return {
    totalMarkets: markets.length,
    volume24h: markets.reduce((sum, m) => sum + safeBigInt(m.volume24h), BigInt(0)).toString(),
    totalTrades: markets.reduce((sum, m) => sum + (m.tradeCount || 0), 0),
  };
}

// `null` means the subgraph never answered — an outage, not an empty venue.
async function fetchMarkets(): Promise<ReadonlyArray<DexMarketView> | null> {
  const data = await fetchSubgraph<{ markets: ReadonlyArray<DexMarket> | null }>(DEX_GRAPHQL_PATH, MARKETS_QUERY);
  if (!data) {
    return null;
  }
  const markets = data.markets ?? [];

  // Resolve base/quote symbols via the existing token metadata endpoint,
  // falling back to a shortened address when a token isn't indexed.
  const addresses = Array.from(new Set(markets.flatMap((m) => [ m.baseToken, m.quoteToken ])));
  const resolved = await Promise.all(addresses.map(async(addr) => [ addr.toLowerCase(), await fetchTokenSymbol(addr) ] as const));
  const symbols = new Map(resolved.filter((entry): entry is readonly [string, string] => Boolean(entry[1])));

  return buildMarketViews(markets, symbols);
}

async function fetchFills(): Promise<ReadonlyArray<DexFill> | null> {
  const data = await fetchSubgraph<{ fills: ReadonlyArray<DexFill> | null }>(DEX_GRAPHQL_PATH, FILLS_QUERY);
  return data ? data.fills ?? [] : null;
}

export interface UseDexDataResult {
  readonly markets: ReadonlyArray<DexMarketView>;
  readonly fills: ReadonlyArray<DexFill>;
  readonly overview: DexOverview;
  readonly status: VenueStatus;
  readonly isLoading: boolean;
  readonly isError: boolean;
}

export function useDexData(): UseDexDataResult {
  const marketsQuery = useQuery({
    queryKey: [ 'dchain:markets', getApiBase() ],
    queryFn: fetchMarkets,
    staleTime: DEX_STALE_TIME_MS,
  });

  const fillsQuery = useQuery({
    queryKey: [ 'dchain:fills', getApiBase() ],
    queryFn: fetchFills,
    staleTime: DEX_STALE_TIME_MS,
  });

  const headBlock = useHeadBlock();

  const markets = marketsQuery.data ?? EMPTY_MARKETS;
  const fills = fillsQuery.data ?? EMPTY_FILLS;

  const overview = React.useMemo<DexOverview>(() => computeOverview(markets), [ markets ]);

  // The CLOB stamps a fill with the block it landed in, same as the AMM.
  const latestBlock = fills.length > 0 ? Math.max(...fills.map((fill) => fill.timestamp)) : null;

  return {
    markets,
    fills,
    overview,
    status: deriveVenueStatus(latestBlock, headBlock, marketsQuery.data !== null),
    isLoading: marketsQuery.isLoading || fillsQuery.isLoading,
    isError: marketsQuery.isError || fillsQuery.isError,
  };
}

function safeBigInt(value: string): bigint {
  try {
    return BigInt(value);
  } catch {
    return BigInt(0);
  }
}
