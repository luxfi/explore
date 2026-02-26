// D-Chain (DEX Chain) API response types for the Lux DexVM indexer.

export interface DexOrder {
  readonly id: string;
  readonly symbol: string;
  readonly side: 'buy' | 'sell';
  readonly price: string;
  readonly quantity: string;
  readonly filled: string;
  readonly status: 'open' | 'filled' | 'cancelled' | 'partial';
  readonly maker: string;
  readonly timestamp: string;
}

export interface DexTrade {
  readonly id: string;
  readonly symbol: string;
  readonly price: string;
  readonly quantity: string;
  readonly buyer: string;
  readonly seller: string;
  readonly fee: string;
  readonly timestamp: string;
  readonly blockHeight: number;
}

export interface DexPool {
  readonly id: string;
  readonly tokenA: string;
  readonly tokenB: string;
  readonly reserveA: string;
  readonly reserveB: string;
  readonly tvl: string;
  readonly volume24h: string;
  readonly fee: string;
}

export interface DexSymbolStats {
  readonly symbol: string;
  readonly lastPrice: string;
  readonly change24h: number;
  readonly volume24h: string;
  readonly high24h: string;
  readonly low24h: string;
  readonly trades24h: number;
}

// Aggregated DEX statistics

export interface DexOverviewStats {
  readonly totalPairs: number;
  readonly volume24h: string;
  readonly activeOrders: number;
  readonly tradesToday: number;
}
