// C-Chain exchange page for the Lux explorer.
//
// Two venues trade on this chain and they are NOT the same thing, so their
// figures are never summed: the AMM (Uniswap-V3-style pools, where the trading
// actually happens today) and the native CLOB at 0x9999. Each section reports
// only its own state, in the vocabulary of lib/api/venueStatus. All data is
// real and network-aware — there is no mock/demo path.

import { Skeleton } from '@luxfi/ui/skeleton';
import BigNumber from 'bignumber.js';
import React from 'react';

import { route } from 'nextjs/routes';

import type { AmmSwapView } from 'lib/api/amm';
import { useAmmData } from 'lib/api/amm';
import type { DexFill, DexMarketView } from 'lib/api/dchain';
import { useDexData } from 'lib/api/dchain';
import type { VenueStatus } from 'lib/api/venueStatus';
import shortenString from 'lib/shortenString';
import { cn } from 'lib/utils/cn';
import PageTitle from 'ui/shared/Page/PageTitle';

// ── Constants ──

const ROW_BASE = 'flex items-center py-3 px-4 border-b border-[var(--color-border-divider)] ' +
  'hover:bg-gray-50 dark:hover:bg-white/5 transition-[background] duration-150 gap-x-4 gap-y-2 flex-wrap lg:flex-nowrap';
const HEADER_BASE = 'hidden lg:flex px-4 py-2 gap-4 border-b border-[var(--color-border-divider)]';
const COL_HEADER = 'text-[var(--color-text-secondary)] font-semibold text-xs uppercase tracking-wider';
const LINK_CLASS = 'text-sm font-mono text-[var(--color-link-primary)] hover:text-[var(--color-link-primary-hover)] hover:underline';

// What each status word means to a reader. The dot colour says the same thing
// without words; neither ever claims more than lib/api/venueStatus established.
const STATUS_LABEL: Record<VenueStatus, string> = {
  live: 'Live',
  idle: 'No recent trades',
  empty: 'Never traded',
  unavailable: 'Indexer unreachable',
  unknown: 'Recency unknown',
};

const STATUS_DOT: Record<VenueStatus, string> = {
  live: 'bg-[var(--color-green-500)]',
  idle: 'bg-warn',
  empty: 'bg-[var(--color-gray-400)]',
  unavailable: 'bg-[var(--color-gray-400)]',
  unknown: 'bg-[var(--color-gray-400)]',
};

// ── Helpers ──

function groupDigits(value: string): string {
  return /^\d+$/.test(value) ? value.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',') : value;
}

function formatFeeTier(feeTier: number): string {
  return `${ (feeTier / 10_000).toFixed(2) }%`;
}

function formatUsd(value: string): string {
  const amount = BigNumber(value);
  return amount.isNaN() ? '—' : `$${ amount.dp(2).toFormat() }`;
}

// ── Sub-components ──

interface Stat {
  readonly label: string;
  readonly value: string;
}

const StatCard = ({ label, value, isLoading }: Stat & { readonly isLoading: boolean }) => (
  <div className="border border-[var(--color-border-divider)] rounded-lg p-4 bg-gray-50 dark:bg-white/5 min-w-0">
    <div className="text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider mb-1 truncate">
      { label }
    </div>
    <Skeleton loading={ isLoading }>
      <div className="text-xl font-bold text-[var(--color-text-primary)] truncate">
        { value }
      </div>
    </Skeleton>
  </div>
);

const StatusBadge = ({ status, isLoading }: { readonly status: VenueStatus; readonly isLoading: boolean }) => (
  <Skeleton loading={ isLoading }>
    <span className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
      <span className={ cn('w-2 h-2 rounded-full shrink-0', STATUS_DOT[status]) }/>
      { STATUS_LABEL[status] }
    </span>
  </Skeleton>
);

interface VenueSectionProps {
  readonly title: string;
  readonly subtitle: string;
  readonly status: VenueStatus;
  readonly isLoading: boolean;
  readonly stats: ReadonlyArray<Stat>;
  readonly children: React.ReactNode;
}

const VenueSection = ({ title, subtitle, status, isLoading, stats, children }: VenueSectionProps) => (
  <section className="mb-10">
    <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{ title }</h2>
        <div className="text-sm text-[var(--color-text-secondary)]">{ subtitle }</div>
      </div>
      <StatusBadge status={ status } isLoading={ isLoading }/>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      { stats.map((stat) => (
        <StatCard key={ stat.label } label={ stat.label } value={ stat.value } isLoading={ isLoading }/>
      )) }
    </div>
    <div className="border border-[var(--color-border-divider)] rounded-lg overflow-hidden">
      { children }
    </div>
  </section>
);

const SwapRow = ({ swap }: { readonly swap: AmmSwapView }) => (
  <div className={ ROW_BASE }>
    <div className="min-w-[240px] grow basis-full lg:basis-auto">
      <span className="text-sm font-mono text-[var(--color-text-primary)]">
        { swap.soldAmount } <span className="font-semibold">{ swap.soldSymbol }</span>
        <span className="text-[var(--color-text-secondary)]"> → </span>
        { swap.boughtAmount } <span className="font-semibold">{ swap.boughtSymbol }</span>
      </span>
    </div>
    <div className="min-w-[130px] shrink-0">
      <span className="text-sm text-[var(--color-text-secondary)]">{ swap.pair }</span>
      <span className="text-xs text-[var(--color-text-secondary)] ml-1">{ formatFeeTier(swap.feeTier) }</span>
    </div>
    <div className="min-w-[120px] shrink-0">
      <a href={ route({ pathname: '/address/[hash]', query: { hash: swap.sender } }) } className={ LINK_CLASS }>
        { shortenString(swap.sender, 10) }
      </a>
    </div>
    <div className="min-w-[90px] shrink-0 text-right">
      <a href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(swap.block) } }) } className={ LINK_CLASS }>
        { groupDigits(String(swap.block)) }
      </a>
    </div>
    <div className="shrink-0 ml-0 lg:ml-auto">
      <a href={ route({ pathname: '/tx/[hash]', query: { hash: swap.txHash } }) } className={ LINK_CLASS }>
        { shortenString(swap.txHash, 12) }
      </a>
    </div>
  </div>
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
        { groupDigits(String(fill.timestamp)) }
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
  const amm = useAmmData();
  const clob = useDexData();

  const pairByMarket = React.useMemo(
    () => new Map(clob.markets.map((market) => [ market.id, market.pair ])),
    [ clob.markets ],
  );

  const ammStats: ReadonlyArray<Stat> = [
    { label: 'Pools', value: String(amm.overview.poolCount) },
    { label: 'Value locked', value: formatUsd(amm.overview.tvlUsd) },
    { label: 'Volume', value: formatUsd(amm.overview.volumeUsd) },
    { label: 'Last swap', value: amm.overview.latestBlock === null ? '—' : `#${ groupDigits(String(amm.overview.latestBlock)) }` },
  ];

  const clobStats: ReadonlyArray<Stat> = [
    { label: 'Markets', value: String(clob.overview.totalMarkets) },
    { label: '24h volume', value: groupDigits(clob.overview.volume24h) },
    { label: 'Trades', value: String(clob.overview.totalTrades) },
    { label: 'Fills shown', value: String(clob.fills.length) },
  ];

  return (
    <>
      <PageTitle
        title="DEX"
        secondRow={ (
          <div className="text-sm text-[var(--color-text-secondary)]">
            Two independent venues trade on the C-Chain. Their figures are reported separately and never combined.
          </div>
        ) }
      />

      <VenueSection
        title="AMM pools"
        subtitle="Uniswap-V3-style concentrated liquidity"
        status={ amm.status }
        isLoading={ amm.isLoading }
        stats={ ammStats }
      >
        <div className={ HEADER_BASE }>
          <div className={ cn(COL_HEADER, 'min-w-[240px] grow') }>Swap</div>
          <div className={ cn(COL_HEADER, 'min-w-[130px]') }>Pool</div>
          <div className={ cn(COL_HEADER, 'min-w-[120px]') }>Sender</div>
          <div className={ cn(COL_HEADER, 'min-w-[90px] text-right') }>Block</div>
          <div className={ cn(COL_HEADER, 'ml-auto text-right') }>Txn</div>
        </div>
        { amm.isLoading && <LoadingSkeleton/> }
        { !amm.isLoading && amm.swaps.length === 0 && (
          <EmptyState text={ amm.status === 'unavailable' ? 'The AMM indexer did not answer' : 'No swaps indexed yet' }/>
        ) }
        { !amm.isLoading && amm.swaps.map((swap) => <SwapRow key={ swap.id } swap={ swap }/>) }
      </VenueSection>

      <VenueSection
        title="Native order book"
        subtitle="The 0x9999 PoolManager CLOB, built into the C-Chain"
        status={ clob.status }
        isLoading={ clob.isLoading }
        stats={ clobStats }
      >
        <div className={ HEADER_BASE }>
          <div className={ cn(COL_HEADER, 'min-w-[160px]') }>Pair</div>
          <div className={ cn(COL_HEADER, 'min-w-[80px] text-right') }>Fee</div>
          <div className={ cn(COL_HEADER, 'min-w-[100px] text-right') }>Last price</div>
          <div className={ cn(COL_HEADER, 'min-w-[140px] text-right') }>24h volume</div>
          <div className={ cn(COL_HEADER, 'ml-auto text-right') }>Trades</div>
        </div>
        { clob.isLoading && <LoadingSkeleton/> }
        { !clob.isLoading && clob.markets.length === 0 && (
          <EmptyState text={
            clob.status === 'unavailable' ?
              'The order-book indexer did not answer' :
              'No market has ever been opened on the native order book'
          }/>
        ) }
        { !clob.isLoading && clob.markets.map((market) => <MarketRow key={ market.id } market={ market }/>) }
        { !clob.isLoading && clob.fills.map((fill) => (
          <FillRow key={ fill.id } fill={ fill } pair={ pairByMarket.get(fill.market) ?? shortenString(fill.market, 10) }/>
        )) }
      </VenueSection>
    </>
  );
};

export default React.memo(DexPage);
