// C-Chain native DEX (0x9999 V4 PoolManager) page for the Lux explorer.
// Renders live markets and recent fills from the embedded dex (CLOB) subgraph.
// All data is real and network-aware — there is no mock/demo path.

import { Skeleton } from '@luxfi/ui/skeleton';
import React from 'react';

import { route } from 'nextjs/routes';

import type { DexFill, DexMarketView } from 'lib/api/dchain';
import { useDexData } from 'lib/api/dchain';
import shortenString from 'lib/shortenString';
import { cn } from 'lib/utils/cn';
import PageTitle from 'ui/shared/Page/PageTitle';

// ── Constants ──

const TAB_IDS = {
  markets: 'markets',
  trades: 'trades',
} as const;

type TabId = typeof TAB_IDS[keyof typeof TAB_IDS];

const ROW_BASE = 'flex items-center py-3 px-4 border-b border-[var(--color-border-divider)] ' +
  'hover:bg-gray-50 dark:hover:bg-white/5 transition-[background] duration-150 gap-4 flex-wrap lg:flex-nowrap';
const HEADER_BASE = 'hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]';
const COL_HEADER = 'text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider';
const LINK_CLASS = 'text-sm font-mono text-[var(--color-link-primary)] hover:text-[var(--color-link-primary-hover)] hover:underline';

// ── Helpers ──

function groupDigits(value: string): string {
  return /^\d+$/.test(value) ? value.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',') : value;
}

function formatFeeTier(feeTier: number): string {
  return `${ (feeTier / 10_000).toFixed(2) }%`;
}

// ── Sub-components ──

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

interface TabButtonProps {
  readonly label: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

const TabButton = ({ label, isActive, onClick }: TabButtonProps) => (
  <button
    className={ cn(
      'px-4 py-2 text-sm bg-transparent cursor-pointer transition-all duration-150 border-b-2 hover:text-[var(--color-text-primary)]',
      isActive ?
        'font-semibold text-[var(--color-text-primary)] border-[var(--color-text-primary)]' :
        'font-normal text-[var(--color-text-secondary)] border-transparent',
    ) }
    onClick={ onClick }
  >
    { label }
  </button>
);

const MarketRow = ({ market }: { readonly market: DexMarketView }) => (
  <div className={ ROW_BASE }>
    <div className="min-w-[160px] shrink-0">
      <span className="font-semibold text-sm text-[var(--color-text-primary)]">{ market.pair }</span>
    </div>
    <div className="min-w-[80px] shrink-0 text-right">
      <span className="text-sm font-mono text-[var(--color-text-secondary)]">{ formatFeeTier(market.feeTier) }</span>
    </div>
    <div className="min-w-[100px] shrink-0 text-right">
      <span className="text-sm font-mono text-[var(--color-text-primary)]">{ market.lastPrice }</span>
    </div>
    <div className="min-w-[140px] shrink-0 text-right">
      <span className="text-sm font-mono text-[var(--color-text-secondary)]">{ groupDigits(market.volume24h) }</span>
    </div>
    <div className="shrink-0 text-right ml-0 lg:ml-auto">
      <span className="text-sm text-[var(--color-text-secondary)]">{ market.tradeCount }</span>
    </div>
  </div>
);

const FillRow = ({ fill, pair }: { readonly fill: DexFill; readonly pair: string }) => (
  <div className={ ROW_BASE }>
    <div className="min-w-[160px] shrink-0">
      <span className="font-medium text-sm text-[var(--color-text-primary)]">{ pair }</span>
    </div>
    <div className="min-w-[140px] shrink-0">
      <a href={ route({ pathname: '/address/[hash]', query: { hash: fill.taker } }) } className={ LINK_CLASS }>
        { shortenString(fill.taker, 10) }
      </a>
    </div>
    <div className="min-w-[140px] shrink-0 text-right">
      <span className="text-sm font-mono text-[var(--color-text-primary)]">{ groupDigits(fill.amountOut) }</span>
    </div>
    <div className="min-w-[90px] shrink-0 text-right">
      <a href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(fill.timestamp) } }) } className={ LINK_CLASS }>
        { fill.timestamp }
      </a>
    </div>
    <div className="shrink-0 ml-0 lg:ml-auto">
      <a href={ route({ pathname: '/tx/[hash]', query: { hash: fill.txHash } }) } className={ LINK_CLASS }>
        { shortenString(fill.txHash, 12) }
      </a>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="px-4 py-6">
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px"/>
  </div>
);

const EmptyState = ({ text }: { readonly text: string }) => (
  <div className="px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]">
    { text }
  </div>
);

// ── Main component ──

const DexPage = () => {
  const [ activeTab, setActiveTab ] = React.useState<TabId>(TAB_IDS.markets);
  const { markets, fills, overview, isLoading } = useDexData();

  const pairByMarket = React.useMemo(
    () => new Map(markets.map((m) => [ m.id, m.pair ])),
    [ markets ],
  );

  const handleMarketsClick = React.useCallback(() => setActiveTab(TAB_IDS.markets), []);
  const handleTradesClick = React.useCallback(() => setActiveTab(TAB_IDS.trades), []);

  return (
    <>
      <PageTitle
        title="DEX"
        secondRow={ (
          <div className="text-sm text-[var(--color-text-secondary)]">
            C-Chain native exchange — live markets and fills from the 0x9999 PoolManager
          </div>
        ) }
      />

      { /* Stats cards */ }
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatCard label="Markets" value={ String(overview.totalMarkets) } isLoading={ isLoading }/>
        <StatCard label="24h Volume" value={ groupDigits(overview.volume24h) } isLoading={ isLoading }/>
        <StatCard label="Total Trades" value={ String(overview.totalTrades) } isLoading={ isLoading }/>
      </div>

      { /* Tabs */ }
      <div className="flex border-b border-[var(--color-border-divider)] mb-4">
        <TabButton label="Markets" isActive={ activeTab === TAB_IDS.markets } onClick={ handleMarketsClick }/>
        <TabButton label="Trades" isActive={ activeTab === TAB_IDS.trades } onClick={ handleTradesClick }/>
      </div>

      { /* Markets tab */ }
      { activeTab === TAB_IDS.markets && (
        <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
          <div className={ HEADER_BASE }>
            <div className={ cn(COL_HEADER, 'min-w-[160px]') }>Pair</div>
            <div className={ cn(COL_HEADER, 'min-w-[80px] text-right') }>Fee</div>
            <div className={ cn(COL_HEADER, 'min-w-[100px] text-right') }>Last Price</div>
            <div className={ cn(COL_HEADER, 'min-w-[140px] text-right') }>24h Volume</div>
            <div className={ cn(COL_HEADER, 'ml-auto text-right') }>Trades</div>
          </div>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && markets.length === 0 && <EmptyState text="No active markets"/> }
          { !isLoading && markets.map((market) => (
            <MarketRow key={ market.id } market={ market }/>
          )) }
        </div>
      ) }

      { /* Trades tab */ }
      { activeTab === TAB_IDS.trades && (
        <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
          <div className={ HEADER_BASE }>
            <div className={ cn(COL_HEADER, 'min-w-[160px]') }>Pair</div>
            <div className={ cn(COL_HEADER, 'min-w-[140px]') }>Taker</div>
            <div className={ cn(COL_HEADER, 'min-w-[140px] text-right') }>Amount Out</div>
            <div className={ cn(COL_HEADER, 'min-w-[90px] text-right') }>Block</div>
            <div className={ cn(COL_HEADER, 'ml-auto text-right') }>Txn</div>
          </div>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && fills.length === 0 && <EmptyState text="No recent trades"/> }
          { !isLoading && fills.map((fill) => (
            <FillRow key={ fill.id } fill={ fill } pair={ pairByMarket.get(fill.market) ?? shortenString(fill.market, 10) }/>
          )) }
        </div>
      ) }
    </>
  );
};

export default React.memo(DexPage);
