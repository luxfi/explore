import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { DexMarket, DexFill, DexMarketView, DexOverview } from './types';

import config from 'configs/app';
import shortenString from 'lib/shortenString';

// One root field per request — the subgraph engine processes a single root
// field per query, so markets and fills are fetched separately.
const MARKETS_QUERY = '{ markets { id symbol baseToken quoteToken feeTier volume24h tradeCount lastPrice lastUpdate } }';
const FILLS_QUERY = '{ fills(first:25) { id market taker amountOut timestamp txHash } }';

const DEX_GRAPHQL_PATH = '/v1/graph/cchain/dex/graphql';
const DEX_STALE_TIME_MS = 30_000;

const EMPTY_MARKETS: ReadonlyArray<DexMarketView> = [];
const EMPTY_FILLS: ReadonlyArray<DexFill> = [];

// The DEX subgraph lives on the same API host the rest of the SPA already
// talks to (NEXT_PUBLIC_API_HOST → config.apis.general.endpoint), so the
// network is selected exactly like every other resource — by deployment.
function getApiBase(): string | undefined {
  return config.apis.general?.endpoint;
}

async function fetchGraphql<T>(query: string): Promise<T | null> {
  const base = getApiBase();
  if (!base) {
    return null;
  }

  let res: Response;
  try {
    res = await fetch(base + DEX_GRAPHQL_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
  } catch {
    return null;
  }

  // A net without the subgraph mounted answers 404 — that is an empty DEX,
  // not an error, so we surface it as "no data" and render the empty state.
  if (!res.ok) {
    return null;
  }

  const json = await res.json().catch(() => null) as { data?: T } | null;
  return json?.data ?? null;
}

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

async function fetchMarkets(): Promise<ReadonlyArray<DexMarketView>> {
  const data = await fetchGraphql<{ markets: ReadonlyArray<DexMarket> | null }>(MARKETS_QUERY);
  const markets = data?.markets ?? [];

  // Resolve base/quote symbols via the existing token metadata endpoint,
  // falling back to a shortened address when a token isn't indexed.
  const addresses = Array.from(new Set(markets.flatMap((m) => [ m.baseToken, m.quoteToken ])));
  const resolved = await Promise.all(addresses.map(async(addr) => [ addr.toLowerCase(), await fetchTokenSymbol(addr) ] as const));
  const symbols = new Map(resolved.filter((entry): entry is readonly [string, string] => Boolean(entry[1])));

  return buildMarketViews(markets, symbols);
}

async function fetchFills(): Promise<ReadonlyArray<DexFill>> {
  const data = await fetchGraphql<{ fills: ReadonlyArray<DexFill> | null }>(FILLS_QUERY);
  return data?.fills ?? [];
}

export interface UseDexDataResult {
  readonly markets: ReadonlyArray<DexMarketView>;
  readonly fills: ReadonlyArray<DexFill>;
  readonly overview: DexOverview;
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

  const markets = marketsQuery.data ?? EMPTY_MARKETS;
  const fills = fillsQuery.data ?? EMPTY_FILLS;

  const overview = React.useMemo<DexOverview>(() => computeOverview(markets), [ markets ]);

  return {
    markets,
    fills,
    overview,
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
