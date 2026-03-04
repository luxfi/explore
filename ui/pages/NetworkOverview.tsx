import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import React from 'react';

import { useBlockchains, useChainHeights, useCurrentValidators } from 'lib/api/pchain';
import type { PChainBlockchain } from 'lib/api/pchain';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import HeroBanner from 'ui/home/HeroBanner';
import LatestBlocks from 'ui/home/LatestBlocks';
import Stats from 'ui/home/Stats';
import Transactions from 'ui/home/Transactions';

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const LUX_DECIMALS = 9;

const PRIMARY_CHAINS = [
  { id: 'C', name: 'C-Chain', fullName: 'Contract Chain', vm: 'EVM', href: '/' },
  { id: 'P', name: 'P-Chain', fullName: 'Platform Chain', vm: 'PVM', href: '/validators' },
  { id: 'X', name: 'X-Chain', fullName: 'Exchange Chain', vm: 'AVM', href: '/chain/x-chain' },
  { id: 'D', name: 'D-Chain', fullName: 'DEX Chain', vm: 'DexVM', href: '/dex' },
  { id: 'A', name: 'A-Chain', fullName: 'AI Chain', vm: 'AIVM', href: '/ai' },
  { id: 'B', name: 'B-Chain', fullName: 'Bridge Chain', vm: 'BridgeVM', href: '/bridge' },
  { id: 'Q', name: 'Q-Chain', fullName: 'Quantum Chain', vm: 'QuantumVM', href: '/chain/q-chain' },
  { id: 'T', name: 'T-Chain', fullName: 'Threshold Chain', vm: 'ThresholdVM', href: '/chain/t-chain' },
  { id: 'Z', name: 'Z-Chain', fullName: 'ZK Chain', vm: 'ZKVM', href: '/chain/z-chain' },
  { id: 'G', name: 'G-Chain', fullName: 'Graph Chain', vm: 'GraphVM', href: '/chain/g-chain' },
  { id: 'K', name: 'K-Chain', fullName: 'Key Chain', vm: 'KeyVM', href: '/chain/k-chain' },
  { id: 'O', name: 'O-Chain', fullName: 'Oracle Chain', vm: 'OracleVM', href: '/chain/o-chain' },
  { id: 'R', name: 'R-Chain', fullName: 'Relay Chain', vm: 'RelayVM', href: '/chain/r-chain' },
  { id: 'I', name: 'I-Chain', fullName: 'Identity Chain', vm: 'IdentityVM', href: '/chain/i-chain' },
] as const;

// Known L1 chains (fallback when P-chain API is unreachable from browser)
const KNOWN_L1_CHAINS: ReadonlyArray<{ readonly name: string; readonly href: string }> = [
  { name: 'Zoo', href: 'https://explore-zoo.lux.network' },
  { name: 'Hanzo', href: 'https://explore-hanzo.lux.network' },
  { name: 'SPC', href: 'https://explore-spc.lux.network' },
  { name: 'Pars', href: 'https://explore-pars.lux.network' },
];

const L1_EXPLORER_URLS: Readonly<Record<string, string>> = {
  Zoo: 'https://explore-zoo.lux.network',
  Hanzo: 'https://explore-hanzo.lux.network',
  SPC: 'https://explore-spc.lux.network',
  Pars: 'https://explore-pars.lux.network',
};

const CARD_BG = { _light: 'gray.50', _dark: 'whiteAlpha.50' };
const CARD_HOVER = { _light: 'gray.100', _dark: 'whiteAlpha.100' };
const CARD_BORDER = '1px solid';

function formatStake(nanoLux: bigint): string {
  const lux = Number(nanoLux) / Math.pow(10, LUX_DECIMALS);
  if (lux >= 1_000_000) return `${ (lux / 1_000_000).toFixed(1) }M`;
  if (lux >= 1_000) return `${ (lux / 1_000).toFixed(1) }K`;
  return lux.toFixed(0);
}

// ── Hero metric (compact inline stat) ──

interface MetricProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const Metric = ({ label, value, isLoading }: MetricProps) => (
  <Flex direction="column" align="center" px={ 3 }>
    <Skeleton loading={ isLoading }>
      <Text fontSize="lg" fontWeight={ 700 } fontFamily="mono" color="text.primary" lineHeight="1.2">
        { value }
      </Text>
    </Skeleton>
    <Text fontSize="2xs" color="text.secondary" fontWeight={ 500 } mt={ 0.5 } textTransform="uppercase" letterSpacing="0.05em">
      { label }
    </Text>
  </Flex>
);

// ── Chain row (compact, for sidebar) ──

interface ChainRowProps {
  readonly name: string;
  readonly fullName: string;
  readonly vm: string;
  readonly href: string | undefined;
  readonly tier?: string;
  readonly height?: number;
  readonly heightLoading?: boolean;
}

const ChainRow = ({ name, fullName, vm, href, tier, height, heightLoading }: ChainRowProps) => {
  const content = (
    <Flex
      align="center"
      justify="space-between"
      py={ 2 }
      px={ 3 }
      borderRadius="md"
      cursor={ href ? 'pointer' : 'default' }
      _hover={ href ? { bg: CARD_HOVER } : undefined }
      transition="background 0.15s"
    >
      <Flex align="center" gap={ 2 }>
        <Text fontWeight={ 600 } color="text.primary" fontSize="sm">
          { name }
        </Text>
        <Text fontSize="xs" color="text.secondary" display={{ base: 'none', lg: 'inline' }}>
          { fullName }
        </Text>
      </Flex>
      <Flex align="center" gap={ 1.5 }>
        { height !== undefined && (
          <Skeleton loading={ heightLoading }>
            <Text fontSize="xs" color="text.secondary" fontFamily="mono">
              { height > 0 ? `#${ height.toLocaleString() }` : '' }
            </Text>
          </Skeleton>
        ) }
        { tier && <Tag size="sm" variant="subtle">{ tier }</Tag> }
        <Tag size="sm" variant="subtle">{ vm }</Tag>
      </Flex>
    </Flex>
  );

  if (href) {
    return <Link href={ href } variant="plain">{ content }</Link>;
  }
  return content;
};

// ── L1 Chain row ──

interface L1ChainRowProps {
  readonly chain: PChainBlockchain;
}

const L1ChainRow = ({ chain }: L1ChainRowProps) => {
  const explorerUrl = L1_EXPLORER_URLS[chain.name];
  const slug = chain.name.toLowerCase();

  const content = (
    <Flex
      align="center"
      justify="space-between"
      py={ 2 }
      px={ 3 }
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: CARD_HOVER }}
      transition="background 0.15s"
    >
      <Flex align="center" gap={ 2 }>
        <Text fontWeight={ 600 } color="text.primary" fontSize="sm">
          { chain.name }
        </Text>
        <Text fontSize="xs" color="text.secondary" fontFamily="mono" display={{ base: 'none', lg: 'inline' }}>
          { chain.id.slice(0, 8) }...
        </Text>
      </Flex>
      <Flex align="center" gap={ 1.5 }>
        <Tag size="sm" variant="subtle">L1</Tag>
        <Text color="text.secondary" fontSize="xs">{ '\u2192' }</Text>
      </Flex>
    </Flex>
  );

  if (explorerUrl) {
    return <Link href={ explorerUrl } variant="plain" target="_blank">{ content }</Link>;
  }
  return <Link href={ `/chains/${ slug }` } variant="plain">{ content }</Link>;
};

// ── Known L1 chain row (fallback when API unavailable) ──

interface KnownL1RowProps {
  readonly name: string;
  readonly href: string;
}

const KnownL1Row = ({ name, href }: KnownL1RowProps) => (
  <Link href={ href } variant="plain" target="_blank">
    <Flex
      align="center"
      justify="space-between"
      py={ 2 }
      px={ 3 }
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: CARD_HOVER }}
      transition="background 0.15s"
    >
      <Text fontWeight={ 600 } color="text.primary" fontSize="sm">
        { name }
      </Text>
      <Flex align="center" gap={ 1.5 }>
        <Tag size="sm" variant="subtle">L1</Tag>
        <Text color="text.secondary" fontSize="xs">{ '\u2192' }</Text>
      </Flex>
    </Flex>
  </Link>
);

// ── Sidebar card ──

interface SidebarCardProps {
  readonly title: string;
  readonly count?: number;
  readonly isLoading?: boolean;
  readonly action?: { label: string; href: string };
  readonly children: React.ReactNode;
}

const SidebarCard = ({ title, count, isLoading, action, children }: SidebarCardProps) => (
  <Box
    border={ CARD_BORDER }
    borderColor="border.divider"
    borderRadius="lg"
    p={ 4 }
    bgColor={ CARD_BG }
  >
    <Flex align="center" justify="space-between" mb={ 3 }>
      <Flex align="center" gap={ 2 }>
        <Heading level="3" fontSize="sm">{ title }</Heading>
        { count !== undefined && (
          <Skeleton loading={ isLoading }>
            <Tag size="sm" variant="subtle">{ count }</Tag>
          </Skeleton>
        ) }
      </Flex>
      { action && (
        <Link href={ action.href } textStyle="xs" color="text.secondary" _hover={{ color: 'text.primary' }}>
          { action.label }
        </Link>
      ) }
    </Flex>
    { children }
  </Box>
);

// ── Main page ──

const NetworkOverview = () => {
  const { stats, isLoading: validatorsLoading, isError: validatorsError } = useCurrentValidators();
  const { blockchains, isLoading: chainsLoading } = useBlockchains();
  const { pChainHeight, cChainHeight, isLoading: heightsLoading } = useChainHeights();

  const l1Chains = React.useMemo(
    () => blockchains.filter((c) => c.subnetID !== PRIMARY_NETWORK_ID),
    [ blockchains ],
  );

  // Use known L1 chains as fallback when P-chain API is unreachable
  const hasL1Data = l1Chains.length > 0;
  const showFallbackL1 = !chainsLoading && !hasL1Data;

  const totalChains = PRIMARY_CHAINS.length + (hasL1Data ? l1Chains.length : KNOWN_L1_CHAINS.length);
  const isLoading = validatorsLoading || chainsLoading;

  // Hide validator metrics when API returned an error (show dashes instead of 0)
  const hasValidatorData = !validatorsError && stats.validatorCount > 0;

  return (
    <Box as="main">
      { /* ── Hero search ── */ }
      <HeroBanner/>

      { /* ── Metrics strip ── */ }
      <Flex
        justify="center"
        align="center"
        py={ 3 }
        mt={ 4 }
        borderRadius="lg"
        border={ CARD_BORDER }
        borderColor="border.divider"
        bgColor={ CARD_BG }
        gap={ 0 }
        flexWrap="wrap"
        overflow="hidden"
      >
        <Metric label="C-Chain" value={ cChainHeight > 0 ? `#${ cChainHeight.toLocaleString() }` : '\u2014' } isLoading={ heightsLoading }/>
        <Box w="1px" h="28px" bgColor="border.divider" display={{ base: 'none', md: 'block' }}/>
        <Metric label="P-Chain" value={ pChainHeight > 0 ? `#${ pChainHeight.toLocaleString() }` : '\u2014' } isLoading={ heightsLoading }/>
        <Box w="1px" h="28px" bgColor="border.divider" display={{ base: 'none', md: 'block' }}/>
        <Metric label="Chains" value={ String(totalChains) } isLoading={ isLoading }/>
        <Box w="1px" h="28px" bgColor="border.divider" display={{ base: 'none', md: 'block' }}/>
        <Metric label="Validators" value={ hasValidatorData ? String(stats.validatorCount) : '\u2014' } isLoading={ validatorsLoading }/>
        <Box w="1px" h="28px" bgColor="border.divider" display={{ base: 'none', md: 'block' }}/>
        <Metric label="Staked" value={ hasValidatorData ? `${ formatStake(stats.totalStake) } LUX` : '\u2014' } isLoading={ validatorsLoading }/>
        <Box w="1px" h="28px" bgColor="border.divider" display={{ base: 'none', md: 'block' }}/>
        <Metric label="Uptime" value={ hasValidatorData ? `${ stats.averageUptime.toFixed(1) }%` : '\u2014' } isLoading={ validatorsLoading }/>
        <Box w="1px" h="28px" bgColor="border.divider" display={{ base: 'none', md: 'block' }}/>
        <Metric
          label="Connected"
          value={ hasValidatorData ? `${ stats.connectedCount }/${ stats.validatorCount }` : '\u2014' }
          isLoading={ validatorsLoading }
        />
      </Flex>

      { /* ── Stats widgets ── */ }
      <Box mt={ 5 }>
        <Stats/>
      </Box>

      { /* ── Latest blocks (full-width horizontal scroll) ── */ }
      <Box mt={ 8 }>
        <LatestBlocks/>
      </Box>

      { /* ── Latest transactions (full-width below blocks) ── */ }
      <Box mt={ 6 }>
        <Transactions/>
      </Box>

      { /* ── Chain Health section (below blocks/txns) ── */ }
      <Grid
        templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }}
        gap={ 4 }
        mt={ 8 }
      >
        { /* Primary Network chains */ }
        <SidebarCard
          title="Primary Network"
          count={ PRIMARY_CHAINS.length }
        >
          <Flex direction="column" gap={ 0 }>
            { PRIMARY_CHAINS.map((chain) => {
              const chainHeight = (() => {
                if (chain.id === 'C') return cChainHeight;
                if (chain.id === 'P') return pChainHeight;
                return undefined;
              })();
              return (
                <ChainRow
                  key={ chain.id }
                  name={ chain.name }
                  fullName={ chain.fullName }
                  vm={ chain.vm }
                  href={ chain.href }
                  height={ chainHeight }
                  heightLoading={ heightsLoading }
                />
              );
            }) }
          </Flex>
        </SidebarCard>

        { /* Subnet / L1 chains */ }
        <SidebarCard
          title="Chains"
          count={ hasL1Data ? l1Chains.length : KNOWN_L1_CHAINS.length }
          isLoading={ chainsLoading }
          action={{ label: 'View all', href: '/chains' }}
        >
          { chainsLoading && (
            <Flex direction="column" gap={ 1 }>
              { Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={ i } loading h="40px" borderRadius="md"/>
              )) }
            </Flex>
          ) }
          { !chainsLoading && hasL1Data && (
            <Flex direction="column" gap={ 0 }>
              { l1Chains.map((chain) => (
                <L1ChainRow key={ chain.id } chain={ chain }/>
              )) }
            </Flex>
          ) }
          { showFallbackL1 && (
            <Flex direction="column" gap={ 0 }>
              { KNOWN_L1_CHAINS.map((chain) => (
                <KnownL1Row key={ chain.name } name={ chain.name } href={ chain.href }/>
              )) }
            </Flex>
          ) }
        </SidebarCard>

        { /* Validators summary card */ }
        <SidebarCard title="Validators">
          { !hasValidatorData && !validatorsLoading ? (
            <Flex direction="column" align="center" py={ 3 }>
              <Text color="text.secondary" fontSize="sm">
                { validatorsError ? 'Unable to fetch validator data.' : 'No validator data available.' }
              </Text>
              <Link href="/validators" textStyle="xs" color="text.secondary" _hover={{ color: 'text.primary' }} mt={ 2 }>
                View validators
              </Link>
            </Flex>
          ) : (
            <>
              <Grid templateColumns="1fr 1fr" gap={ 3 }>
                <Box>
                  <Skeleton loading={ validatorsLoading }>
                    <Text fontWeight={ 700 } fontFamily="mono" fontSize="md">
                      { hasValidatorData ? stats.validatorCount : '\u2014' }
                    </Text>
                  </Skeleton>
                  <Text fontSize="2xs" color="text.secondary">Active</Text>
                </Box>
                <Box>
                  <Skeleton loading={ validatorsLoading }>
                    <Text fontWeight={ 700 } fontFamily="mono" fontSize="md">
                      { hasValidatorData ? formatStake(stats.totalStake) : '\u2014' }
                    </Text>
                  </Skeleton>
                  <Text fontSize="2xs" color="text.secondary">Total Stake (LUX)</Text>
                </Box>
                <Box>
                  <Skeleton loading={ validatorsLoading }>
                    <Text fontWeight={ 700 } fontFamily="mono" fontSize="md">
                      { hasValidatorData ? stats.delegatorCount : '\u2014' }
                    </Text>
                  </Skeleton>
                  <Text fontSize="2xs" color="text.secondary">Delegators</Text>
                </Box>
                <Box>
                  <Skeleton loading={ validatorsLoading }>
                    <Text fontWeight={ 700 } fontFamily="mono" fontSize="md">
                      { hasValidatorData ? `${ stats.connectedCount }/${ stats.validatorCount }` : '\u2014' }
                    </Text>
                  </Skeleton>
                  <Text fontSize="2xs" color="text.secondary">Connected</Text>
                </Box>
              </Grid>
              <Flex justify="center" mt={ 3 }>
                <Link href="/validators" textStyle="xs" color="text.secondary" _hover={{ color: 'text.primary' }}>
                  View validators
                </Link>
              </Flex>
            </>
          ) }
        </SidebarCard>
      </Grid>
    </Box>
  );
};

export default React.memo(NetworkOverview);
