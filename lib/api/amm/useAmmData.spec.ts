import type { AmmFactory, AmmSwap } from './types';

import { deriveVenueStatus } from 'lib/api/venueStatus';
import { expect, test, describe } from 'vitest';

import { buildSwapViews, computeAmmOverview } from './useAmmData';

// Real shapes returned by the mainnet cchain/amm subgraph — the WLUX/LZOO
// 0.30% pool at block 1,098,074. `timestamp` really is the block number.
const POOL = {
  id: '0x1c000d5dbe1246fb84ad431e933e5563f212a62b',
  feeTier: 3000,
  token0: { id: '0x4888e4a2ee0f03051c72d2bd3acf755ed3498b3e', symbol: 'WLUX', decimals: 18 },
  token1: { id: '0x5e5290f350352768bd2bfc59c2da15dd04a7cb88', symbol: 'LZOO', decimals: 18 },
} as const;

// Trader sold WLUX: the pool received amount0 and paid out amount1.
const SELL_TOKEN0: AmmSwap = {
  id: '0xf1c526609ce9aaadc70ba77e4f27db9ea79a64ac35edbc96bf719a2956e7abfc#0x2',
  timestamp: 1098074,
  amount0: '100000000000000000000',
  amount1: '-2168447796713672942095',
  sender: '0x939bc0bca6f9b9c52e6e3ad8a3c590b5d9b9d10e',
  pool: POOL,
};

// The mirror trade: the pool received LZOO and paid out WLUX.
const SELL_TOKEN1: AmmSwap = {
  id: '0x7dece36d553a609f37a209d65eeb851513539de111ac935840149f4b577200fb#0x2',
  timestamp: 1098073,
  amount0: '-99400900225431259546',
  amount1: '2168447806549312938443',
  sender: '0x939bc0bca6f9b9c52e6e3ad8a3c590b5d9b9d10e',
  pool: POOL,
};

const FACTORY: AmmFactory = {
  poolCount: 32,
  totalValueLockedUSD: '125992.93',
  totalVolumeUSD: '2572.68',
};

describe('buildSwapViews', () => {
  test('reads a positive amount0 as the trader selling token0', () => {
    const [ view ] = buildSwapViews([ SELL_TOKEN0 ]);
    expect(view.soldSymbol).toBe('WLUX');
    expect(view.boughtSymbol).toBe('LZOO');
  });

  test('reads a negative amount0 as the trader buying token0', () => {
    const [ view ] = buildSwapViews([ SELL_TOKEN1 ]);
    expect(view.soldSymbol).toBe('LZOO');
    expect(view.boughtSymbol).toBe('WLUX');
  });

  test('scales each amount by its own token decimals and drops the sign', () => {
    const [ view ] = buildSwapViews([ SELL_TOKEN0 ]);
    expect(view.soldAmount).toBe('100');
    expect(view.boughtAmount).toBe('2,168.4478');
  });

  test('splits the subgraph key into a linkable tx hash', () => {
    const [ view ] = buildSwapViews([ SELL_TOKEN0 ]);
    expect(view.txHash).toBe('0xf1c526609ce9aaadc70ba77e4f27db9ea79a64ac35edbc96bf719a2956e7abfc');
    expect(view.block).toBe(1098074);
  });

  test('labels the pair and keeps the fee tier', () => {
    const [ view ] = buildSwapViews([ SELL_TOKEN0 ]);
    expect(view.pair).toBe('WLUX/LZOO');
    expect(view.feeTier).toBe(3000);
  });

  test('returns an empty list for no swaps (empty state)', () => {
    expect(buildSwapViews([])).toHaveLength(0);
  });
});

describe('computeAmmOverview', () => {
  test('passes factory totals through untouched and takes the newest block', () => {
    expect(computeAmmOverview(FACTORY, [ SELL_TOKEN0, SELL_TOKEN1 ])).toEqual({
      poolCount: 32,
      tvlUsd: '125992.93',
      volumeUsd: '2572.68',
      latestBlock: 1098074,
    });
  });

  test('reports no latest block when nothing has traded', () => {
    expect(computeAmmOverview(FACTORY, []).latestBlock).toBeNull();
  });

  test('is zeroed when the factory is unreadable', () => {
    expect(computeAmmOverview(null, [])).toEqual({
      poolCount: 0, tvlUsd: '0', volumeUsd: '0', latestBlock: null,
    });
  });
});

describe('deriveVenueStatus', () => {
  test('an unreachable indexer is unavailable, never empty', () => {
    expect(deriveVenueStatus(null, 1098100, false)).toBe('unavailable');
  });

  test('a reachable venue with no trades at all is empty', () => {
    expect(deriveVenueStatus(null, 1098100, true)).toBe('empty');
  });

  test('a trade inside the recent window is live', () => {
    expect(deriveVenueStatus(1098074, 1098100, true)).toBe('live');
  });

  test('a trade far behind the head is idle', () => {
    expect(deriveVenueStatus(1000000, 1098100, true)).toBe('idle');
  });

  test('without a chain head, recency is unknown rather than guessed', () => {
    expect(deriveVenueStatus(1098074, null, true)).toBe('unknown');
  });
});
