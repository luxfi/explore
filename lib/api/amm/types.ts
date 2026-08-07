// C-Chain AMM (Uniswap-V3-style concentrated-liquidity pools) subgraph types.
// Source: the explorer's embedded luxfi/graph "amm" subgraph, served at
// `${config.apis.general.endpoint}/v1/graph/cchain/amm/graphql`. Pools come
// from the factory's PoolCreated event and swaps from each pool's Swap event.
//
// That engine answers a fixed shape per entity and ignores the selection set,
// so these types describe what it sends rather than what we ask for.

export interface AmmToken {
  readonly id: string;
  readonly symbol: string;
  readonly decimals: number;
}

export interface AmmPool {
  readonly id: string;
  readonly feeTier: number;
  readonly token0: AmmToken;
  readonly token1: AmmToken;
}

export interface AmmSwap {
  readonly id: string;
  // A BLOCK NUMBER, not a unix time — the indexer writes the block height into
  // this field. Rendering it as a date would be a lie.
  readonly timestamp: number;
  // Signed, in the token's own base units, from the POOL's point of view:
  // positive is what the pool received, negative is what it paid out.
  readonly amount0: string;
  readonly amount1: string;
  readonly sender: string;
  readonly pool: AmmPool;
}

export interface AmmFactory {
  readonly poolCount: number;
  readonly totalValueLockedUSD: string;
  readonly totalVolumeUSD: string;
}

// A swap resolved into the direction a human reads it: what was sold, what was
// bought, both scaled by their own token's decimals.
export interface AmmSwapView {
  readonly id: string;
  readonly txHash: string;
  readonly block: number;
  readonly sender: string;
  readonly pair: string;
  readonly feeTier: number;
  readonly soldSymbol: string;
  readonly soldAmount: string;
  readonly boughtSymbol: string;
  readonly boughtAmount: string;
}

// Headline aggregates. Every field is read straight off the indexer — none is
// inferred, and the swap total is deliberately absent because the engine caps
// a result set and ignores `skip`, so we cannot count what we cannot page.
export interface AmmOverview {
  readonly poolCount: number;
  readonly tvlUsd: string;
  readonly volumeUsd: string;
  readonly latestBlock: number | null;
}
