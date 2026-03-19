// DEX Chain (D-Chain) orderbook page for the Lux multi-chain explorer.
// Shows real market data from the DexVM indexer when available,
// or a "Coming Soon" state when the D-Chain DEX is not yet live.

import React from 'react';

import { cn } from 'lib/utils/cn';

import { useDexData } from 'lib/api/dchain';
import type { DexOrder, DexTrade, DexPool, DexSymbolStats } from 'lib/api/dchain';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import PageTitle from 'ui/shared/Page/PageTitle';

// ── Constants ──

const TAB_IDS = {
  markets: 'markets',
  orderbook: 'orderbook',
  trades: 'trades',
  pools: 'pools',
} as const;

type TabId = typeof TAB_IDS[keyof typeof TAB_IDS];

const ROW_BASE = 'flex items-center py-3 px-4 border-b border-[var(--color-border-divider)] hover:bg-gray-50 dark:hover:bg-white/5 transition-[background] duration-150 gap-4 flex-wrap lg:flex-nowrap';
const HEADER_BASE = 'hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]';
const COL_HEADER = 'text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider';

// ── Sub-components ──

interface TabButtonProps {
  readonly label: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

const TabButton = ({ label, isActive, onClick }: TabButtonProps) => (
  <button
    className={ cn(
      'px-4 py-2 text-sm bg-transparent cursor-pointer transition-all duration-150 border-b-2 hover:text-[var(--color-text-primary)]',
      isActive ? 'font-semibold text-[var(--color-text-primary)] border-[var(--color-text-primary)]' : 'font-normal text-[var(--color-text-secondary)] border-transparent',
    ) }
    onClick={ onClick }
  >
    { label }
  </button>
);

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const StatCard = ({ label, value, isLoading }: StatCardProps) => (
  <div className="border border-[var(--color-border-divider)] rounded-lg p-5 bg-gray-50 dark:bg-white/5">
    <div className="text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1">
      { label }
    </div>
    <Skeleton loading={ isLoading }>
      <div className="text-2xl font-bold text-[var(--color-text-primary)]">
        { value }
      </div>
    </Skeleton>
  </div>
);

// ── Symbol row ──

interface SymbolRowProps {
  readonly stat: DexSymbolStats;
}

const SymbolRow = ({ stat }: SymbolRowProps) => {
  const isPositive = stat.change24h >= 0;

  return (
    <div className={ ROW_BASE }>
      <div className="min-w-[120px] shrink-0">
        <span className="font-semibold text-sm text-[var(--color-text-primary)]">{ stat.symbol }</span>
      </div>
      <div className="min-w-[100px] shrink-0 text-right">
        <span className="text-sm font-mono text-[var(--color-text-primary)]">{ stat.lastPrice }</span>
      </div>
      <div className="min-w-[80px] shrink-0 text-right">
        <span className={ `text-sm font-medium ${ isPositive ? 'text-green-400' : 'text-red-400' }` }>
          { isPositive ? '+' : '' }{ stat.change24h.toFixed(2) }%
        </span>
      </div>
      <div className="min-w-[100px] shrink-0 text-right">
        <span className="text-sm font-mono text-[var(--color-text-secondary)]">{ stat.high24h }</span>
      </div>
      <div className="min-w-[100px] shrink-0 text-right">
        <span className="text-sm font-mono text-[var(--color-text-secondary)]">{ stat.low24h }</span>
      </div>
      <div className="min-w-[120px] shrink-0 text-right">
        <span className="text-sm font-mono text-[var(--color-text-secondary)]">${ stat.volume24h }</span>
      </div>
      <div className="shrink-0 text-right ml-0 lg:ml-auto">
        <span className="text-sm text-[var(--color-text-secondary)]">{ stat.trades24h }</span>
      </div>
    </div>
  );
};

// ── Order row ──

interface OrderRowProps {
  readonly order: DexOrder;
}

const OrderRow = ({ order }: OrderRowProps) => {
  const isBuy = order.side === 'buy';

  return (
    <div className={ ROW_BASE }>
      <div className="min-w-[100px] shrink-0">
        <span className="text-sm text-[var(--color-text-primary)]">{ order.symbol }</span>
      </div>
      <div className="min-w-[60px] shrink-0">
        <Tag size="sm" variant="subtle" className={ isBuy ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }>
          { order.side.toUpperCase() }
        </Tag>
      </div>
      <div className="min-w-[100px] shrink-0 text-right">
        <span className={ `text-sm font-mono ${ isBuy ? 'text-green-400' : 'text-red-400' }` }>{ order.price }</span>
      </div>
      <div className="min-w-[100px] shrink-0 text-right">
        <span className="text-sm font-mono text-[var(--color-text-primary)]">{ order.quantity }</span>
      </div>
      <div className="min-w-[120px] shrink-0 text-right">
        <span className="text-sm font-mono text-[var(--color-text-secondary)]">
          { (parseFloat(order.price) * parseFloat(order.quantity)).toFixed(2) }
        </span>
      </div>
      <div className="min-w-[100px] shrink-0">
        <span className="text-sm font-mono text-[var(--color-text-secondary)]">{ order.maker }</span>
      </div>
      <div className="min-w-[80px] shrink-0">
        <span className="text-sm text-[var(--color-text-secondary)]">{ formatTime(order.timestamp) }</span>
      </div>
      <div className="shrink-0 ml-0 lg:ml-auto">
        <Tag size="sm" variant="subtle" className={ getStatusClassName(order.status) }>
          { order.status }
        </Tag>
      </div>
    </div>
  );
};

// ── Trade row ──

interface TradeRowProps {
  readonly trade: DexTrade;
}

const TradeRow = ({ trade }: TradeRowProps) => (
  <div className={ ROW_BASE }>
    <div className="min-w-[100px] shrink-0">
      <span className="font-medium text-sm text-[var(--color-text-primary)]">{ trade.symbol }</span>
    </div>
    <div className="min-w-[100px] shrink-0 text-right">
      <span className="text-sm font-mono text-[var(--color-text-primary)]">{ trade.price }</span>
    </div>
    <div className="min-w-[100px] shrink-0 text-right">
      <span className="text-sm font-mono text-[var(--color-text-primary)]">{ trade.quantity }</span>
    </div>
    <div className="min-w-[100px] shrink-0">
      <span className="text-sm font-mono text-[var(--color-text-secondary)]">{ trade.buyer }</span>
    </div>
    <div className="min-w-[100px] shrink-0">
      <span className="text-sm font-mono text-[var(--color-text-secondary)]">{ trade.seller }</span>
    </div>
    <div className="min-w-[60px] shrink-0 text-right">
      <span className="text-sm font-mono text-[var(--color-text-secondary)]">{ trade.fee }</span>
    </div>
    <div className="shrink-0 text-right ml-0 lg:ml-auto">
      <span className="text-sm text-[var(--color-text-secondary)]">{ formatTime(trade.timestamp) }</span>
    </div>
  </div>
);

// ── Pool row ──

interface PoolRowProps {
  readonly pool: DexPool;
}

const PoolRow = ({ pool }: PoolRowProps) => (
  <div className={ ROW_BASE }>
    <div className="min-w-[120px] shrink-0">
      <span className="font-semibold text-sm text-[var(--color-text-primary)]">{ pool.tokenA }/{ pool.tokenB }</span>
    </div>
    <div className="min-w-[120px] shrink-0 text-right">
      <span className="text-sm font-mono text-[var(--color-text-primary)]">{ pool.reserveA }</span>
    </div>
    <div className="min-w-[120px] shrink-0 text-right">
      <span className="text-sm font-mono text-[var(--color-text-primary)]">{ pool.reserveB }</span>
    </div>
    <div className="min-w-[120px] shrink-0 text-right">
      <span className="text-sm font-mono font-semibold text-[var(--color-text-primary)]">${ pool.tvl }</span>
    </div>
    <div className="min-w-[120px] shrink-0 text-right">
      <span className="text-sm font-mono text-[var(--color-text-secondary)]">${ pool.volume24h }</span>
    </div>
    <div className="shrink-0 text-right ml-0 lg:ml-auto">
      <span className="text-sm text-[var(--color-text-secondary)]">{ pool.fee }</span>
    </div>
  </div>
);

// ── Loading skeleton ──

const LoadingSkeleton = () => (
  <div className="px-4 py-6">
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px"/>
  </div>
);

// ── Empty state ──

const EmptyState = ({ message }: { readonly message: string }) => (
  <div className="px-4 py-8 text-center text-[var(--color-text-secondary)] text-sm">
    { message }
  </div>
);

// ── Coming Soon state ──

const ComingSoonState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
      DEX Coming Soon
    </div>
    <div className="text-sm text-[var(--color-text-secondary)] text-center max-w-md">
      The D-Chain decentralized exchange is not yet live.
      Trading data will appear here once the DexVM is deployed and active on the network.
    </div>
  </div>
);

// ── Main component ──

const DexPage = () => {
  const [ activeTab, setActiveTab ] = React.useState<TabId>(TAB_IDS.markets);
  const { symbols, orders, trades, pools, overview, isLoading, hasData } = useDexData();

  const handleMarketsClick = React.useCallback(() => setActiveTab(TAB_IDS.markets), []);
  const handleOrderbookClick = React.useCallback(() => setActiveTab(TAB_IDS.orderbook), []);
  const handleTradesClick = React.useCallback(() => setActiveTab(TAB_IDS.trades), []);
  const handlePoolsClick = React.useCallback(() => setActiveTab(TAB_IDS.pools), []);

  // When there is no real DEX data, show "Coming Soon" instead of fake numbers
  if (!isLoading && !hasData) {
    return (
      <>
        <PageTitle
          title="DEX"
          secondRow={ (
            <div className="text-sm text-[var(--color-text-secondary)]">
              D-Chain decentralized exchange orderbook and market data
            </div>
          ) }
        />
        <div className="border border-[var(--color-border-divider)] rounded-lg">
          <ComingSoonState/>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title="DEX"
        secondRow={ (
          <div className="text-sm text-[var(--color-text-secondary)]">
            D-Chain decentralized exchange orderbook and market data
          </div>
        ) }
      />

      { /* Stats cards */ }
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Pairs" value={ String(overview.totalPairs) } isLoading={ isLoading }/>
        <StatCard label="24h Volume" value={ `$${ overview.volume24h }` } isLoading={ isLoading }/>
        <StatCard label="Active Orders" value={ String(overview.activeOrders) } isLoading={ isLoading }/>
        <StatCard label="Trades Today" value={ String(overview.tradesToday) } isLoading={ isLoading }/>
      </div>

      { /* Tabs */ }
      <div className="flex border-b border-[var(--color-border-divider)] mb-4">
        <TabButton label="Markets" isActive={ activeTab === TAB_IDS.markets } onClick={ handleMarketsClick }/>
        <TabButton label="Orderbook" isActive={ activeTab === TAB_IDS.orderbook } onClick={ handleOrderbookClick }/>
        <TabButton label="Trades" isActive={ activeTab === TAB_IDS.trades } onClick={ handleTradesClick }/>
        <TabButton label="Pools" isActive={ activeTab === TAB_IDS.pools } onClick={ handlePoolsClick }/>
      </div>

      { /* Markets tab */ }
      { activeTab === TAB_IDS.markets && (
        <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
          <div className={ HEADER_BASE }>
            <div className={ cn(COL_HEADER, 'min-w-[120px]') }>Symbol</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px] text-right') }>Price</div>
            <div className={ cn(COL_HEADER, 'min-w-[80px] text-right') }>24h Change</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px] text-right') }>24h High</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px] text-right') }>24h Low</div>
            <div className={ cn(COL_HEADER, 'min-w-[120px] text-right') }>24h Volume</div>
            <div className={ cn(COL_HEADER, 'ml-auto text-right') }>Trades</div>
          </div>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && symbols.length === 0 && <EmptyState message="No trading pairs available"/> }
          { !isLoading && symbols.map((stat) => (
            <SymbolRow key={ stat.symbol } stat={ stat }/>
          )) }
        </div>
      ) }

      { /* Orderbook tab */ }
      { activeTab === TAB_IDS.orderbook && (
        <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
          <div className={ HEADER_BASE }>
            <div className={ cn(COL_HEADER, 'min-w-[100px]') }>Symbol</div>
            <div className={ cn(COL_HEADER, 'min-w-[60px]') }>Side</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px] text-right') }>Price</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px] text-right') }>Quantity</div>
            <div className={ cn(COL_HEADER, 'min-w-[120px] text-right') }>Total</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px]') }>Maker</div>
            <div className={ cn(COL_HEADER, 'min-w-[80px]') }>Time</div>
            <div className={ cn(COL_HEADER, 'ml-auto text-right') }>Status</div>
          </div>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && orders.length === 0 && <EmptyState message="No open orders"/> }
          { !isLoading && orders.map((order) => (
            <OrderRow key={ order.id } order={ order }/>
          )) }
        </div>
      ) }

      { /* Trades tab */ }
      { activeTab === TAB_IDS.trades && (
        <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
          <div className={ HEADER_BASE }>
            <div className={ cn(COL_HEADER, 'min-w-[100px]') }>Symbol</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px] text-right') }>Price</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px] text-right') }>Quantity</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px]') }>Buyer</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px]') }>Seller</div>
            <div className={ cn(COL_HEADER, 'min-w-[60px] text-right') }>Fee</div>
            <div className={ cn(COL_HEADER, 'ml-auto text-right') }>Time</div>
          </div>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && trades.length === 0 && <EmptyState message="No recent trades"/> }
          { !isLoading && trades.map((trade) => (
            <TradeRow key={ trade.id } trade={ trade }/>
          )) }
        </div>
      ) }

      { /* Pools tab */ }
      { activeTab === TAB_IDS.pools && (
        <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
          <div className={ HEADER_BASE }>
            <div className={ cn(COL_HEADER, 'min-w-[120px]') }>Pair</div>
            <div className={ cn(COL_HEADER, 'min-w-[120px] text-right') }>Reserve A</div>
            <div className={ cn(COL_HEADER, 'min-w-[120px] text-right') }>Reserve B</div>
            <div className={ cn(COL_HEADER, 'min-w-[120px] text-right') }>TVL</div>
            <div className={ cn(COL_HEADER, 'min-w-[120px] text-right') }>24h Volume</div>
            <div className={ cn(COL_HEADER, 'ml-auto text-right') }>Fee</div>
          </div>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && pools.length === 0 && <EmptyState message="No liquidity pools"/> }
          { !isLoading && pools.map((pool) => (
            <PoolRow key={ pool.id } pool={ pool }/>
          )) }
        </div>
      ) }
    </>
  );
};

// ── Helpers ──

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getStatusClassName(status: DexOrder['status']): string {
  switch (status) {
    case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'filled': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'partial': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}

export default React.memo(DexPage);
