// DEX Chain (D-Chain) orderbook page for the Lux multi-chain explorer.
// Displays market stats, orderbook, trade history, and liquidity pools
// sourced from the DexVM indexer.

import React from 'react';

import { cn } from 'lib/utils/cn';

import { useDexData } from 'lib/api/dchain';
import type { DexOrder, DexTrade, DexPool, DexSymbolStats } from 'lib/api/dchain';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import PageTitle from 'ui/shared/Page/PageTitle';

// ── Constants ──

const TAB_IDS = {
  markets: 'markets',
  orderbook: 'orderbook',
  trades: 'trades',
  pools: 'pools',
} as const;

type TabId = typeof TAB_IDS[keyof typeof TAB_IDS];

const STAT_CARD_BG = { _light: 'gray.50', _dark: 'whiteAlpha.50' };

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
  <div
    border="1px solid"
    borderColor="border.divider"
    borderRadius="lg"
    p={ 5 }
    bgColor={ STAT_CARD_BG }
  >
    <div fontSize="xs" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={ 1 }>
      { label }
    </div>
    <Skeleton loading={ isLoading }>
      <div fontSize="2xl" fontWeight="700" color="text.primary">
        { value }
      </div>
    </Skeleton>
  </div>
);

// ── Table header ──

interface ColumnHeaderProps {
  readonly children: React.ReactNode;
  readonly flex?: number | string;
  readonly minW?: string;
  readonly w?: string;
  readonly ml?: string;
  readonly textAlign?: 'left' | 'right';
}

const ColumnHeader = ({ children, flex, minW, w, ml, textAlign = 'left' }: ColumnHeaderProps) => (
  <div
    flex={ flex }
    minW={ minW }
    w={ w }
    ml={ ml }
    color="text.secondary"
    fontWeight="600"
    fontSize="xs"
    textTransform="uppercase"
    letterSpacing="wider"
    textAlign={ textAlign }
  >
    { children }
  </div>
);

// ── Symbol row ──

interface SymbolRowProps {
  readonly stat: DexSymbolStats;
}

const SymbolRow = ({ stat }: SymbolRowProps) => {
  const isPositive = stat.change24h >= 0;

  return (
    <div
      alignItems="center"
      py={ 3 }
      px={ 4 }
      borderBottom="1px solid"
      borderColor="border.divider"
      _hover={{ bg: STAT_CARD_BG }}
      transition="background 0.15s"
      gap={ 4 }
      flexWrap={{ base: 'wrap', lg: 'nowrap' }}
    >
      <div minW="120px" flexShrink={ 0 }>
        <span fontWeight="600" fontSize="sm" color="text.primary">
          { stat.symbol }
        </span>
      </div>
      <div minW="100px" flexShrink={ 0 } textAlign="right">
        <span fontSize="sm" fontFamily="mono" color="text.primary">
          { stat.lastPrice }
        </span>
      </div>
      <div minW="80px" flexShrink={ 0 } textAlign="right">
        <span fontSize="sm" fontWeight="500" color={ isPositive ? 'green.400' : 'red.400' }>
          { isPositive ? '+' : '' }{ stat.change24h.toFixed(2) }%
        </span>
      </div>
      <div minW="100px" flexShrink={ 0 } textAlign="right">
        <span fontSize="sm" fontFamily="mono" color="text.secondary">
          { stat.high24h }
        </span>
      </div>
      <div minW="100px" flexShrink={ 0 } textAlign="right">
        <span fontSize="sm" fontFamily="mono" color="text.secondary">
          { stat.low24h }
        </span>
      </div>
      <div minW="120px" flexShrink={ 0 } textAlign="right">
        <span fontSize="sm" fontFamily="mono" color="text.secondary">
          ${ stat.volume24h }
        </span>
      </div>
      <div flexShrink={ 0 } textAlign="right" ml={{ base: 0, lg: 'auto' }}>
        <span fontSize="sm" color="text.secondary">
          { stat.trades24h }
        </span>
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
    <div
      alignItems="center"
      py={ 3 }
      px={ 4 }
      borderBottom="1px solid"
      borderColor="border.divider"
      _hover={{ bg: STAT_CARD_BG }}
      transition="background 0.15s"
      gap={ 4 }
      flexWrap={{ base: 'wrap', lg: 'nowrap' }}
    >
      <div minW="100px" flexShrink={ 0 }>
        <span fontSize="sm" color="text.primary">
          { order.symbol }
        </span>
      </div>
      <div minW="60px" flexShrink={ 0 }>
        <Tag size="sm" variant="subtle" className={ isBuy ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }>
          { order.side.toUpperCase() }
        </Tag>
      </div>
      <div minW="100px" flexShrink={ 0 } textAlign="right">
        <span fontSize="sm" fontFamily="mono" color={ isBuy ? 'green.400' : 'red.400' }>
          { order.price }
        </span>
      </div>
      <div minW="100px" flexShrink={ 0 } textAlign="right">
        <span fontSize="sm" fontFamily="mono" color="text.primary">
          { order.quantity }
        </span>
      </div>
      <div minW="120px" flexShrink={ 0 } textAlign="right">
        <span fontSize="sm" fontFamily="mono" color="text.secondary">
          { (parseFloat(order.price) * parseFloat(order.quantity)).toFixed(2) }
        </span>
      </div>
      <div minW="100px" flexShrink={ 0 }>
        <span fontSize="sm" fontFamily="mono" color="text.secondary">
          { order.maker }
        </span>
      </div>
      <div minW="80px" flexShrink={ 0 }>
        <span fontSize="sm" color="text.secondary">
          { formatTime(order.timestamp) }
        </span>
      </div>
      <div flexShrink={ 0 } ml={{ base: 0, lg: 'auto' }}>
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
  <div
    alignItems="center"
    py={ 3 }
    px={ 4 }
    borderBottom="1px solid"
    borderColor="border.divider"
    _hover={{ bg: STAT_CARD_BG }}
    transition="background 0.15s"
    gap={ 4 }
    flexWrap={{ base: 'wrap', lg: 'nowrap' }}
  >
    <div minW="100px" flexShrink={ 0 }>
      <span fontWeight="500" fontSize="sm" color="text.primary">
        { trade.symbol }
      </span>
    </div>
    <div minW="100px" flexShrink={ 0 } textAlign="right">
      <span fontSize="sm" fontFamily="mono" color="text.primary">
        { trade.price }
      </span>
    </div>
    <div minW="100px" flexShrink={ 0 } textAlign="right">
      <span fontSize="sm" fontFamily="mono" color="text.primary">
        { trade.quantity }
      </span>
    </div>
    <div minW="100px" flexShrink={ 0 }>
      <span fontSize="sm" fontFamily="mono" color="text.secondary">
        { trade.buyer }
      </span>
    </div>
    <div minW="100px" flexShrink={ 0 }>
      <span fontSize="sm" fontFamily="mono" color="text.secondary">
        { trade.seller }
      </span>
    </div>
    <div minW="60px" flexShrink={ 0 } textAlign="right">
      <span fontSize="sm" fontFamily="mono" color="text.secondary">
        { trade.fee }
      </span>
    </div>
    <div flexShrink={ 0 } textAlign="right" ml={{ base: 0, lg: 'auto' }}>
      <span fontSize="sm" color="text.secondary">
        { formatTime(trade.timestamp) }
      </span>
    </div>
  </div>
);

// ── Pool row ──

interface PoolRowProps {
  readonly pool: DexPool;
}

const PoolRow = ({ pool }: PoolRowProps) => (
  <div
    alignItems="center"
    py={ 3 }
    px={ 4 }
    borderBottom="1px solid"
    borderColor="border.divider"
    _hover={{ bg: STAT_CARD_BG }}
    transition="background 0.15s"
    gap={ 4 }
    flexWrap={{ base: 'wrap', lg: 'nowrap' }}
  >
    <div minW="120px" flexShrink={ 0 }>
      <span fontWeight="600" fontSize="sm" color="text.primary">
        { pool.tokenA }/{ pool.tokenB }
      </span>
    </div>
    <div minW="120px" flexShrink={ 0 } textAlign="right">
      <span fontSize="sm" fontFamily="mono" color="text.primary">
        { pool.reserveA }
      </span>
    </div>
    <div minW="120px" flexShrink={ 0 } textAlign="right">
      <span fontSize="sm" fontFamily="mono" color="text.primary">
        { pool.reserveB }
      </span>
    </div>
    <div minW="120px" flexShrink={ 0 } textAlign="right">
      <span fontSize="sm" fontFamily="mono" fontWeight="600" color="text.primary">
        ${ pool.tvl }
      </span>
    </div>
    <div minW="120px" flexShrink={ 0 } textAlign="right">
      <span fontSize="sm" fontFamily="mono" color="text.secondary">
        ${ pool.volume24h }
      </span>
    </div>
    <div flexShrink={ 0 } textAlign="right" ml={{ base: 0, lg: 'auto' }}>
      <span fontSize="sm" color="text.secondary">
        { pool.fee }
      </span>
    </div>
  </div>
);

// ── Loading skeleton ──

const LoadingSkeleton = () => (
  <div px={ 4 } py={ 6 }>
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px"/>
  </div>
);

// ── Main component ──

const DexPage = () => {
  const [ activeTab, setActiveTab ] = React.useState<TabId>(TAB_IDS.markets);
  const { symbols, orders, trades, pools, overview, isLoading } = useDexData();

  const handleMarketsClick = React.useCallback(() => setActiveTab(TAB_IDS.markets), []);
  const handleOrderbookClick = React.useCallback(() => setActiveTab(TAB_IDS.orderbook), []);
  const handleTradesClick = React.useCallback(() => setActiveTab(TAB_IDS.trades), []);
  const handlePoolsClick = React.useCallback(() => setActiveTab(TAB_IDS.pools), []);

  return (
    <>
      <PageTitle
        title="DEX"
        secondRow={ (
          <div fontSize="sm" color="text.secondary">
            D-Chain decentralized exchange orderbook and market data
          </div>
        ) }
      />

      { /* Stats cards */ }
      <div
        display="grid"
        gridTemplateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }}
        gap={ 3 }
        mb={ 6 }
      >
        <StatCard label="Total Pairs" value={ String(overview.totalPairs) } isLoading={ isLoading }/>
        <StatCard label="24h Volume" value={ `$${ overview.volume24h }` } isLoading={ isLoading }/>
        <StatCard label="Active Orders" value={ String(overview.activeOrders) } isLoading={ isLoading }/>
        <StatCard label="Trades Today" value={ String(overview.tradesToday) } isLoading={ isLoading }/>
      </div>

      { /* Tabs */ }
      <div borderBottom="1px solid" borderColor="border.divider" mb={ 4 } gap={ 0 }>
        <TabButton label="Markets" isActive={ activeTab === TAB_IDS.markets } onClick={ handleMarketsClick }/>
        <TabButton label="Orderbook" isActive={ activeTab === TAB_IDS.orderbook } onClick={ handleOrderbookClick }/>
        <TabButton label="Trades" isActive={ activeTab === TAB_IDS.trades } onClick={ handleTradesClick }/>
        <TabButton label="Pools" isActive={ activeTab === TAB_IDS.pools } onClick={ handlePoolsClick }/>
      </div>

      { /* Markets tab */ }
      { activeTab === TAB_IDS.markets && (
        <div border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
          <div px={ 4 } py={ 2 } gap={ 4 } borderBottom="1px solid" borderColor="border.divider" display={{ base: 'none', lg: 'flex' }}>
            <ColumnHeader minW="120px">Symbol</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">Price</ColumnHeader>
            <ColumnHeader minW="80px" textAlign="right">24h Change</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">24h High</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">24h Low</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">24h Volume</ColumnHeader>
            <ColumnHeader ml="auto" textAlign="right">Trades</ColumnHeader>
          </div>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && symbols.map((stat) => (
            <SymbolRow key={ stat.symbol } stat={ stat }/>
          )) }
        </div>
      ) }

      { /* Orderbook tab */ }
      { activeTab === TAB_IDS.orderbook && (
        <div border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
          <div px={ 4 } py={ 2 } gap={ 4 } borderBottom="1px solid" borderColor="border.divider" display={{ base: 'none', lg: 'flex' }}>
            <ColumnHeader minW="100px">Symbol</ColumnHeader>
            <ColumnHeader minW="60px">Side</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">Price</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">Quantity</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">Total</ColumnHeader>
            <ColumnHeader minW="100px">Maker</ColumnHeader>
            <ColumnHeader minW="80px">Time</ColumnHeader>
            <ColumnHeader ml="auto" textAlign="right">Status</ColumnHeader>
          </div>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && orders.map((order) => (
            <OrderRow key={ order.id } order={ order }/>
          )) }
        </div>
      ) }

      { /* Trades tab */ }
      { activeTab === TAB_IDS.trades && (
        <div border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
          <div px={ 4 } py={ 2 } gap={ 4 } borderBottom="1px solid" borderColor="border.divider" display={{ base: 'none', lg: 'flex' }}>
            <ColumnHeader minW="100px">Symbol</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">Price</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">Quantity</ColumnHeader>
            <ColumnHeader minW="100px">Buyer</ColumnHeader>
            <ColumnHeader minW="100px">Seller</ColumnHeader>
            <ColumnHeader minW="60px" textAlign="right">Fee</ColumnHeader>
            <ColumnHeader ml="auto" textAlign="right">Time</ColumnHeader>
          </div>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && trades.map((trade) => (
            <TradeRow key={ trade.id } trade={ trade }/>
          )) }
        </div>
      ) }

      { /* Pools tab */ }
      { activeTab === TAB_IDS.pools && (
        <div border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
          <div px={ 4 } py={ 2 } gap={ 4 } borderBottom="1px solid" borderColor="border.divider" display={{ base: 'none', lg: 'flex' }}>
            <ColumnHeader minW="120px">Pair</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">Reserve A</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">Reserve B</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">TVL</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">24h Volume</ColumnHeader>
            <ColumnHeader ml="auto" textAlign="right">Fee</ColumnHeader>
          </div>
          { isLoading && <LoadingSkeleton/> }
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
