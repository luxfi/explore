// Network Overview homepage for the Lux multi-chain explorer.
// Displays P-chain stats, primary chains, and L1 (subnet) chains.

import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import React from 'react';

import { useBlockchains, useCurrentValidators } from 'lib/api/pchain';
import type { PChainBlockchain } from 'lib/api/pchain';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import HeroBanner from 'ui/home/HeroBanner';

// ── Constants ──

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const LUX_DECIMALS = 9;

const PRIMARY_CHAINS = [
  { id: 'C', name: 'C-Chain', fullName: 'Contract Chain', vm: 'EVM', href: '/' },
  { id: 'P', name: 'P-Chain', fullName: 'Platform Chain', vm: 'PVM', href: undefined },
  { id: 'X', name: 'X-Chain', fullName: 'Exchange Chain', vm: 'AVM', href: undefined },
  { id: 'A', name: 'A-Chain', fullName: 'AI Chain', vm: 'AVM', href: undefined },
  { id: 'B', name: 'B-Chain', fullName: 'Bridge Chain', vm: 'BVM', href: undefined },
  { id: 'Q', name: 'Q-Chain', fullName: 'Quantum Chain', vm: 'QVM', href: undefined },
  { id: 'T', name: 'T-Chain', fullName: 'Teleport Chain', vm: 'MPC', href: undefined },
  { id: 'Z', name: 'Z-Chain', fullName: 'ZK Chain', vm: 'ZVM', href: undefined },
  { id: 'K', name: 'K-Chain', fullName: 'KMS Chain', vm: 'KVM', href: undefined },
] as const;

const STAT_CARD_BG = { _light: 'gray.50', _dark: 'whiteAlpha.50' };
const CHAIN_CARD_HOVER_BG = { _light: 'gray.50', _dark: 'whiteAlpha.50' };
// ── Helpers ──

function formatStake(nanoLux: bigint): string {
  const lux = Number(nanoLux) / Math.pow(10, LUX_DECIMALS);
  if (lux >= 1_000_000) return `${ (lux / 1_000_000).toFixed(1) }M`;
  if (lux >= 1_000) return `${ (lux / 1_000).toFixed(1) }K`;
  return lux.toFixed(0);
}

function formatUptime(uptime: number): string {
  return `${ uptime.toFixed(1) }%`;
}

// ── Sub-components ──

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const StatCard = ({ label, value, isLoading }: StatCardProps) => (
  <Box
    p={{ base: 4, lg: 5 }}
    borderRadius="lg"
    border="1px solid"
    borderColor="border.divider"
    bgColor={ STAT_CARD_BG }
  >
    <Text fontSize="sm" color="text.secondary" mb={ 1 }>
      { label }
    </Text>
    <Skeleton loading={ isLoading }>
      <Text fontSize={{ base: 'xl', lg: '2xl' }} fontWeight={ 600 } color="text.primary">
        { value }
      </Text>
    </Skeleton>
  </Box>
);

interface PrimaryChainCardProps {
  readonly id: string;
  readonly name: string;
  readonly fullName: string;
  readonly vm: string;
  readonly href: string | undefined;
}

const PrimaryChainCard = ({ name, fullName, vm, href }: PrimaryChainCardProps) => {
  const content = (
    <Flex
      align="center"
      justify="space-between"
      p={ 4 }
      borderRadius="md"
      border="1px solid"
      borderColor="border.divider"
      cursor={ href ? 'pointer' : 'default' }
      _hover={ href ? { bg: CHAIN_CARD_HOVER_BG } : undefined }
      transition="background 0.15s ease"
    >
      <Flex align="center" gap={ 3 }>
        <Box>
          <Text fontWeight={ 500 } color="text.primary" fontSize="sm">
            { name }
          </Text>
          <Text fontSize="xs" color="text.secondary">
            { fullName }
          </Text>
        </Box>
      </Flex>
      <Flex align="center" gap={ 2 }>
        <Tag size="sm" variant="subtle">{ vm }</Tag>
        { href && (
          <Text color="text.secondary" fontSize="sm">
            { '\u2192' }
          </Text>
        ) }
      </Flex>
    </Flex>
  );

  if (href) {
    return (
      <Link href={ href } variant="plain">
        { content }
      </Link>
    );
  }

  return content;
};

interface L1ChainCardProps {
  readonly chain: PChainBlockchain;
}

const L1ChainCard = ({ chain }: L1ChainCardProps) => (
  <Flex
    align="center"
    justify="space-between"
    p={ 4 }
    borderRadius="md"
    border="1px solid"
    borderColor="border.divider"
    transition="background 0.15s ease"
  >
    <Flex align="center" gap={ 3 }>
      <Box>
        <Text fontWeight={ 500 } color="text.primary" fontSize="sm">
          { chain.name }
        </Text>
        <Text fontSize="xs" color="text.secondary" wordBreak="break-all">
          { chain.id.slice(0, 12) }...
        </Text>
      </Box>
    </Flex>
    <Tag size="sm" variant="subtle">L1</Tag>
  </Flex>
);

interface L1ChainsListProps {
  readonly chains: ReadonlyArray<PChainBlockchain>;
  readonly isLoading: boolean;
}

const SKELETON_PLACEHOLDER_COUNT = 4;

const L1ChainsList = ({ chains, isLoading }: L1ChainsListProps) => {
  if (isLoading) {
    return (
      <Flex direction="column" gap={ 2 }>
        { Array.from({ length: SKELETON_PLACEHOLDER_COUNT }).map((_, i) => (
          <Skeleton key={ i } loading={ true } h="68px" borderRadius="md"/>
        )) }
      </Flex>
    );
  }

  if (chains.length === 0) {
    return (
      <Text color="text.secondary" fontSize="sm" py={ 4 }>
        No L1 chains registered yet.
      </Text>
    );
  }

  return (
    <Flex direction="column" gap={ 2 }>
      { chains.map((chain) => (
        <L1ChainCard key={ chain.id } chain={ chain }/>
      )) }
    </Flex>
  );
};

// ── Main component ──

const NetworkOverview = () => {
  const isMobile = useIsMobile();
  const { stats, isLoading: validatorsLoading } = useCurrentValidators();
  const { blockchains, isLoading: chainsLoading } = useBlockchains();

  const l1Chains = React.useMemo(
    () => blockchains.filter((c) => c.subnetID !== PRIMARY_NETWORK_ID),
    [ blockchains ],
  );

  const totalChains = React.useMemo(
    () => PRIMARY_CHAINS.length + l1Chains.length,
    [ l1Chains.length ],
  );

  const isLoading = validatorsLoading || chainsLoading;

  return (
    <Box as="main">
      <HeroBanner/>

      { /* Stats bar */ }
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={{ base: 2, lg: 3 }}
        mt={ 6 }
      >
        <StatCard
          label="Total Chains"
          value={ String(totalChains) }
          isLoading={ isLoading }
        />
        <StatCard
          label="Validators"
          value={ String(stats.validatorCount) }
          isLoading={ isLoading }
        />
        <StatCard
          label="Total Stake"
          value={ `${ formatStake(stats.totalStake) } LUX` }
          isLoading={ isLoading }
        />
        <StatCard
          label="Avg Uptime"
          value={ formatUptime(stats.averageUptime) }
          isLoading={ isLoading }
        />
      </Grid>

      { /* Chains section: Primary Network + L1 Chains */ }
      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        gap={{ base: 6, lg: 8 }}
        mt={ 8 }
      >
        { /* Primary Network column */ }
        <Box>
          <Heading level="2" mb={ 4 }>
            Primary Network
          </Heading>
          <Flex direction="column" gap={ 2 }>
            { PRIMARY_CHAINS.map((chain) => (
              <PrimaryChainCard
                key={ chain.id }
                id={ chain.id }
                name={ chain.name }
                fullName={ chain.fullName }
                vm={ chain.vm }
                href={ chain.href }
              />
            )) }
          </Flex>
        </Box>

        { /* L1 Chains column */ }
        <Box>
          <Flex align="center" justify="space-between" mb={ 4 }>
            <Flex align="center" gap={ 2 }>
              <Heading level="2">
                L1 Chains
              </Heading>
              <Skeleton loading={ chainsLoading }>
                <Tag size="sm" variant="subtle">{ l1Chains.length }</Tag>
              </Skeleton>
            </Flex>
          </Flex>
          <L1ChainsList chains={ l1Chains } isLoading={ chainsLoading }/>
        </Box>
      </Grid>

      { /* Bottom search bar (desktop only) */ }
      { !isMobile && (
        <Box mt={ 10 } mb={ 4 }>
          <Text color="text.secondary" fontSize="sm" mb={ 3 } textAlign="center">
            Search by address, transaction hash, block, or token
          </Text>
        </Box>
      ) }
    </Box>
  );
};

export default React.memo(NetworkOverview);
