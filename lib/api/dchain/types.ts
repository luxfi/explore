// C-Chain native DEX (0x9999 V4 PoolManager) subgraph types.
// Source: the explorer's embedded luxfi/graph "dex" (CLOB) subgraph, served at
// `${config.apis.general.endpoint}/v1/graph/cchain/dex/graphql`. Markets are
// emitted by the on-chain Initialize event and fills by the DEXFill event.

export interface DexMarket {
  readonly id: string;
  readonly baseToken: string;
  readonly quoteToken: string;
  readonly feeTier: number;
  readonly volume24h: string;
  readonly tradeCount: number;
  readonly lastPrice: string;
  readonly lastUpdate: number;
}

export interface DexFill {
  readonly id: string;
  readonly market: string;
  readonly taker: string;
  readonly amountOut: string;
  readonly timestamp: number;
  readonly txHash: string;
}

// A market with its base/quote token symbols resolved to a human pair label.
export interface DexMarketView extends DexMarket {
  readonly pair: string;
}

// Aggregated headline stats derived from the live market set.
export interface DexOverview {
  readonly totalMarkets: number;
  readonly volume24h: string;
  readonly totalTrades: number;
}
