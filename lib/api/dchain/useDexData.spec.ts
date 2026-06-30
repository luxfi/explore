import type { DexMarket } from './types';

import { expect, test, describe } from 'vitest';

import { buildMarketViews, computeOverview } from './useDexData';

// Real shapes returned by the testnet cchain/dex subgraph.
const MARKET_A: DexMarket = {
  id: '0x70ed78d5fb8fd83110ffb5b6726edb3d76e0968d5dba042e59e0c97af1a1f2cd',
  baseToken: '0xaa1c9a2527f70aee8c163fc053ccbba0e0df7a37',
  quoteToken: '0xf90434869b41d554c6446aacd73c06406b6ce9c1',
  feeTier: 3000,
  volume24h: '10',
  tradeCount: 1,
  lastPrice: '0',
  lastUpdate: 11,
};

const MARKET_B: DexMarket = {
  id: '0x2b0a2ff82be3beb2d2b58d0766b1c6c0b3f9bb44689e469bb49934e4e32802f1',
  baseToken: '0xa811aac7a2e132c167650f93f3e14305e6205f95',
  quoteToken: '0xccba5e1036dcab7ff4885975d339cafab2a4c0c4',
  feeTier: 3000,
  volume24h: '1258432996',
  tradeCount: 21,
  lastPrice: '0',
  lastUpdate: 325,
};

describe('buildMarketViews', () => {
  test('falls back to a shortened address when a token has no metadata', () => {
    const [ view ] = buildMarketViews([ MARKET_A ], new Map());
    expect(view.pair).toBe('0xaa1c...7a37/0xf904...e9c1');
  });

  test('resolves symbols from the metadata map (case-insensitive)', () => {
    const symbols = new Map([
      [ MARKET_A.baseToken.toLowerCase(), 'LUX' ],
      [ MARKET_A.quoteToken.toLowerCase(), 'USDC' ],
    ]);
    const [ view ] = buildMarketViews([ MARKET_A ], symbols);
    expect(view.pair).toBe('LUX/USDC');
  });

  test('preserves the source market fields', () => {
    const [ view ] = buildMarketViews([ MARKET_A ], new Map());
    expect(view).toMatchObject({ id: MARKET_A.id, feeTier: 3000, tradeCount: 1, volume24h: '10' });
  });

  test('returns an empty list for no markets (empty state)', () => {
    expect(buildMarketViews([], new Map())).toHaveLength(0);
  });
});

describe('computeOverview', () => {
  test('aggregates market count, big-int volume, and trade count', () => {
    const views = buildMarketViews([ MARKET_A, MARKET_B ], new Map());
    expect(computeOverview(views)).toEqual({
      totalMarkets: 2,
      volume24h: '1258433006',
      totalTrades: 22,
    });
  });

  test('is zeroed for an empty market set', () => {
    expect(computeOverview([])).toEqual({ totalMarkets: 0, volume24h: '0', totalTrades: 0 });
  });
});
