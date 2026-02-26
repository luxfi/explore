// DEX Chain (D-Chain) orderbook page for the Lux multi-chain explorer.
// Displays market stats, orderbook, trade history, and liquidity pools
// sourced from the DexVM indexer.

import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

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
  <Box
    as="button"
    px={ 4 }
    py={ 2 }
    fontSize="sm"
    fontWeight={ isActive ? '600' : '400' }
    color={ isActive ? 'text.primary' : 'text.secondary' }
    borderBottom="2px solid"
    borderColor={ isActive ? 'text.primary' : 'transparent' }
    bg="transparent"
    cursor="pointer"
    transition="all 0.15s"
    _hover={{ color: 'text.primary' }}
    onClick={ onClick }
  >
    { label }
  </Box>
);

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const StatCard = ({ label, value, isLoading }: StatCardProps) => (
  <Box
    border="1px solid"
    borderColor="border.divider"
    borderRadius="lg"
    p={ 5 }
    bgColor={ STAT_CARD_BG }
  >
    <Box fontSize="xs" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={ 1 }>
      { label }
    </Box>
    <Skeleton loading={ isLoading }>
      <Box fontSize="2xl" fontWeight="700" color="text.primary">
        { value }
      </Box>
    </Skeleton>
  </Box>
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
  <Box
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
  </Box>
);

// ── Symbol row ──

interface SymbolRowProps {
  readonly stat: DexSymbolStats;
}

const SymbolRow = ({ stat }: SymbolRowProps) => {
  const isPositive = stat.change24h >= 0;

  return (
    <Flex
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
      <Box minW="120px" flexShrink={ 0 }>
        <Text fontWeight="600" fontSize="sm" color="text.primary">
          { stat.symbol }
        </Text>
      </Box>
      <Box minW="100px" flexShrink={ 0 } textAlign="right">
        <Text fontSize="sm" fontFamily="mono" color="text.primary">
          { stat.lastPrice }
        </Text>
      </Box>
      <Box minW="80px" flexShrink={ 0 } textAlign="right">
        <Text fontSize="sm" fontWeight="500" color={ isPositive ? 'green.400' : 'red.400' }>
          { isPositive ? '+' : '' }{ stat.change24h.toFixed(2) }%
        </Text>
      </Box>
      <Box minW="100px" flexShrink={ 0 } textAlign="right">
        <Text fontSize="sm" fontFamily="mono" color="text.secondary">
          { stat.high24h }
        </Text>
      </Box>
      <Box minW="100px" flexShrink={ 0 } textAlign="right">
        <Text fontSize="sm" fontFamily="mono" color="text.secondary">
          { stat.low24h }
        </Text>
      </Box>
      <Box minW="120px" flexShrink={ 0 } textAlign="right">
        <Text fontSize="sm" fontFamily="mono" color="text.secondary">
          ${ stat.volume24h }
        </Text>
      </Box>
      <Box flexShrink={ 0 } textAlign="right" ml={{ base: 0, lg: 'auto' }}>
        <Text fontSize="sm" color="text.secondary">
          { stat.trades24h }
        </Text>
      </Box>
    </Flex>
  );
};

// ── Order row ──

interface OrderRowProps {
  readonly order: DexOrder;
}

const OrderRow = ({ order }: OrderRowProps) => {
  const isBuy = order.side === 'buy';

  return (
    <Flex
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
      <Box minW="100px" flexShrink={ 0 }>
        <Text fontSize="sm" color="text.primary">
          { order.symbol }
        </Text>
      </Box>
      <Box minW="60px" flexShrink={ 0 }>
        <Tag size="sm" variant="subtle" colorPalette={ isBuy ? 'green' : 'red' }>
          { order.side.toUpperCase() }
        </Tag>
      </Box>
      <Box minW="100px" flexShrink={ 0 } textAlign="right">
        <Text fontSize="sm" fontFamily="mono" color={ isBuy ? 'green.400' : 'red.400' }>
          { order.price }
        </Text>
      </Box>
      <Box minW="100px" flexShrink={ 0 } textAlign="right">
        <Text fontSize="sm" fontFamily="mono" color="text.primary">
          { order.quantity }
        </Text>
      </Box>
      <Box minW="120px" flexShrink={ 0 } textAlign="right">
        <Text fontSize="sm" fontFamily="mono" color="text.secondary">
          { (parseFloat(order.price) * parseFloat(order.quantity)).toFixed(2) }
        </Text>
      </Box>
      <Box minW="100px" flexShrink={ 0 }>
        <Text fontSize="sm" fontFamily="mono" color="text.secondary">
          { order.maker }
        </Text>
      </Box>
      <Box minW="80px" flexShrink={ 0 }>
        <Text fontSize="sm" color="text.secondary">
          { formatTime(order.timestamp) }
        </Text>
      </Box>
      <Box flexShrink={ 0 } ml={{ base: 0, lg: 'auto' }}>
        <Tag size="sm" variant="subtle" colorPalette={ getStatusColor(order.status) }>
          { order.status }
        </Tag>
      </Box>
    </Flex>
  );
};

// ── Trade row ──

interface TradeRowProps {
  readonly trade: DexTrade;
}

const TradeRow = ({ trade }: TradeRowProps) => (
  <Flex
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
    <Box minW="100px" flexShrink={ 0 }>
      <Text fontWeight="500" fontSize="sm" color="text.primary">
        { trade.symbol }
      </Text>
    </Box>
    <Box minW="100px" flexShrink={ 0 } textAlign="right">
      <Text fontSize="sm" fontFamily="mono" color="text.primary">
        { trade.price }
      </Text>
    </Box>
    <Box minW="100px" flexShrink={ 0 } textAlign="right">
      <Text fontSize="sm" fontFamily="mono" color="text.primary">
        { trade.quantity }
      </Text>
    </Box>
    <Box minW="100px" flexShrink={ 0 }>
      <Text fontSize="sm" fontFamily="mono" color="text.secondary">
        { trade.buyer }
      </Text>
    </Box>
    <Box minW="100px" flexShrink={ 0 }>
      <Text fontSize="sm" fontFamily="mono" color="text.secondary">
        { trade.seller }
      </Text>
    </Box>
    <Box minW="60px" flexShrink={ 0 } textAlign="right">
      <Text fontSize="sm" fontFamily="mono" color="text.secondary">
        { trade.fee }
      </Text>
    </Box>
    <Box flexShrink={ 0 } textAlign="right" ml={{ base: 0, lg: 'auto' }}>
      <Text fontSize="sm" color="text.secondary">
        { formatTime(trade.timestamp) }
      </Text>
    </Box>
  </Flex>
);

// ── Pool row ──

interface PoolRowProps {
  readonly pool: DexPool;
}

const PoolRow = ({ pool }: PoolRowProps) => (
  <Flex
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
    <Box minW="120px" flexShrink={ 0 }>
      <Text fontWeight="600" fontSize="sm" color="text.primary">
        { pool.tokenA }/{ pool.tokenB }
      </Text>
    </Box>
    <Box minW="120px" flexShrink={ 0 } textAlign="right">
      <Text fontSize="sm" fontFamily="mono" color="text.primary">
        { pool.reserveA }
      </Text>
    </Box>
    <Box minW="120px" flexShrink={ 0 } textAlign="right">
      <Text fontSize="sm" fontFamily="mono" color="text.primary">
        { pool.reserveB }
      </Text>
    </Box>
    <Box minW="120px" flexShrink={ 0 } textAlign="right">
      <Text fontSize="sm" fontFamily="mono" fontWeight="600" color="text.primary">
        ${ pool.tvl }
      </Text>
    </Box>
    <Box minW="120px" flexShrink={ 0 } textAlign="right">
      <Text fontSize="sm" fontFamily="mono" color="text.secondary">
        ${ pool.volume24h }
      </Text>
    </Box>
    <Box flexShrink={ 0 } textAlign="right" ml={{ base: 0, lg: 'auto' }}>
      <Text fontSize="sm" color="text.secondary">
        { pool.fee }
      </Text>
    </Box>
  </Flex>
);

// ── Loading skeleton ──

const LoadingSkeleton = () => (
  <Box px={ 4 } py={ 6 }>
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px" mb={ 3 }/>
    <Skeleton loading h="16px"/>
  </Box>
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
          <Box fontSize="sm" color="text.secondary">
            D-Chain decentralized exchange orderbook and market data
          </Box>
        ) }
      />

      { /* Stats cards */ }
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }}
        gap={ 3 }
        mb={ 6 }
      >
        <StatCard label="Total Pairs" value={ String(overview.totalPairs) } isLoading={ isLoading }/>
        <StatCard label="24h Volume" value={ `$${ overview.volume24h }` } isLoading={ isLoading }/>
        <StatCard label="Active Orders" value={ String(overview.activeOrders) } isLoading={ isLoading }/>
        <StatCard label="Trades Today" value={ String(overview.tradesToday) } isLoading={ isLoading }/>
      </Box>

      { /* Tabs */ }
      <Flex borderBottom="1px solid" borderColor="border.divider" mb={ 4 } gap={ 0 }>
        <TabButton label="Markets" isActive={ activeTab === TAB_IDS.markets } onClick={ handleMarketsClick }/>
        <TabButton label="Orderbook" isActive={ activeTab === TAB_IDS.orderbook } onClick={ handleOrderbookClick }/>
        <TabButton label="Trades" isActive={ activeTab === TAB_IDS.trades } onClick={ handleTradesClick }/>
        <TabButton label="Pools" isActive={ activeTab === TAB_IDS.pools } onClick={ handlePoolsClick }/>
      </Flex>

      { /* Markets tab */ }
      { activeTab === TAB_IDS.markets && (
        <Box border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
          <Flex px={ 4 } py={ 2 } gap={ 4 } borderBottom="1px solid" borderColor="border.divider" display={{ base: 'none', lg: 'flex' }}>
            <ColumnHeader minW="120px">Symbol</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">Price</ColumnHeader>
            <ColumnHeader minW="80px" textAlign="right">24h Change</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">24h High</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">24h Low</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">24h Volume</ColumnHeader>
            <ColumnHeader ml="auto" textAlign="right">Trades</ColumnHeader>
          </Flex>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && symbols.map((stat) => (
            <SymbolRow key={ stat.symbol } stat={ stat }/>
          )) }
        </Box>
      ) }

      { /* Orderbook tab */ }
      { activeTab === TAB_IDS.orderbook && (
        <Box border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
          <Flex px={ 4 } py={ 2 } gap={ 4 } borderBottom="1px solid" borderColor="border.divider" display={{ base: 'none', lg: 'flex' }}>
            <ColumnHeader minW="100px">Symbol</ColumnHeader>
            <ColumnHeader minW="60px">Side</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">Price</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">Quantity</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">Total</ColumnHeader>
            <ColumnHeader minW="100px">Maker</ColumnHeader>
            <ColumnHeader minW="80px">Time</ColumnHeader>
            <ColumnHeader ml="auto" textAlign="right">Status</ColumnHeader>
          </Flex>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && orders.map((order) => (
            <OrderRow key={ order.id } order={ order }/>
          )) }
        </Box>
      ) }

      { /* Trades tab */ }
      { activeTab === TAB_IDS.trades && (
        <Box border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
          <Flex px={ 4 } py={ 2 } gap={ 4 } borderBottom="1px solid" borderColor="border.divider" display={{ base: 'none', lg: 'flex' }}>
            <ColumnHeader minW="100px">Symbol</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">Price</ColumnHeader>
            <ColumnHeader minW="100px" textAlign="right">Quantity</ColumnHeader>
            <ColumnHeader minW="100px">Buyer</ColumnHeader>
            <ColumnHeader minW="100px">Seller</ColumnHeader>
            <ColumnHeader minW="60px" textAlign="right">Fee</ColumnHeader>
            <ColumnHeader ml="auto" textAlign="right">Time</ColumnHeader>
          </Flex>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && trades.map((trade) => (
            <TradeRow key={ trade.id } trade={ trade }/>
          )) }
        </Box>
      ) }

      { /* Pools tab */ }
      { activeTab === TAB_IDS.pools && (
        <Box border="1px solid" borderColor="border.divider" borderRadius="lg" overflow="hidden">
          <Flex px={ 4 } py={ 2 } gap={ 4 } borderBottom="1px solid" borderColor="border.divider" display={{ base: 'none', lg: 'flex' }}>
            <ColumnHeader minW="120px">Pair</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">Reserve A</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">Reserve B</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">TVL</ColumnHeader>
            <ColumnHeader minW="120px" textAlign="right">24h Volume</ColumnHeader>
            <ColumnHeader ml="auto" textAlign="right">Fee</ColumnHeader>
          </Flex>
          { isLoading && <LoadingSkeleton/> }
          { !isLoading && pools.map((pool) => (
            <PoolRow key={ pool.id } pool={ pool }/>
          )) }
        </Box>
      ) }
    </>
  );
};

// ── Helpers ──

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getStatusColor(status: DexOrder['status']): string {
  switch (status) {
    case 'open': return 'blue';
    case 'filled': return 'green';
    case 'partial': return 'orange';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
}

export default React.memo(DexPage);
