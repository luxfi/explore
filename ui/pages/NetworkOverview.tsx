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

const L1_EXPLORER_URLS: Readonly<Record<string, string>> = {
  Zoo: 'https://explore-zoo.lux.network',
  Hanzo: 'https://explore-hanzo.lux.network',
  SPC: 'https://explore-spc.lux.network',
  Pars: 'https://explore-pars.lux.network',
};

const STAT_CARD_BG = { _light: 'gray.50', _dark: 'whiteAlpha.50' };
const CHAIN_CARD_HOVER = { _light: 'gray.50', _dark: 'whiteAlpha.100' };

function formatStake(nanoLux: bigint): string {
  const lux = Number(nanoLux) / Math.pow(10, LUX_DECIMALS);
  if (lux >= 1_000_000) return `${ (lux / 1_000_000).toFixed(1) }M`;
  if (lux >= 1_000) return `${ (lux / 1_000).toFixed(1) }K`;
  return lux.toFixed(0);
}

interface NetworkStatProps {
  readonly label: string;
  readonly value: string;
  readonly isLoading: boolean;
}

const NetworkStat = ({ label, value, isLoading }: NetworkStatProps) => (
  <Box textAlign="center">
    <Skeleton loading={ isLoading }>
      <Text fontSize={{ base: 'lg', lg: '2xl' }} fontWeight={ 700 } color="text.primary">
        { value }
      </Text>
    </Skeleton>
    <Text fontSize="xs" color="text.secondary" fontWeight={ 500 } mt={ 0.5 }>
      { label }
    </Text>
  </Box>
);

interface ChainCardProps {
  readonly name: string;
  readonly fullName: string;
  readonly vm: string;
  readonly href: string | undefined;
}

const ChainCard = ({ name, fullName, vm, href }: ChainCardProps) => {
  const content = (
    <Flex
      align="center"
      justify="space-between"
      p={ 3 }
      borderRadius="md"
      border="1px solid"
      borderColor="border.divider"
      cursor={ href ? 'pointer' : 'default' }
      _hover={ href ? { bg: CHAIN_CARD_HOVER } : undefined }
      transition="background 0.15s"
    >
      <Box>
        <Text fontWeight={ 600 } color="text.primary" fontSize="sm">
          { name }
        </Text>
        <Text fontSize="xs" color="text.secondary">
          { fullName }
        </Text>
      </Box>
      <Flex align="center" gap={ 2 }>
        <Tag size="sm" variant="subtle">{ vm }</Tag>
        { href && <Text color="text.secondary" fontSize="sm">{ '\u2192' }</Text> }
      </Flex>
    </Flex>
  );

  if (href) {
    return <Link href={ href } variant="plain">{ content }</Link>;
  }
  return content;
};

interface L1ChainCardProps {
  readonly chain: PChainBlockchain;
}

const L1ChainCard = ({ chain }: L1ChainCardProps) => {
  const explorerUrl = L1_EXPLORER_URLS[chain.name];
  const slug = chain.name.toLowerCase();

  const content = (
    <Flex
      align="center"
      justify="space-between"
      p={ 3 }
      borderRadius="md"
      border="1px solid"
      borderColor="border.divider"
      cursor="pointer"
      _hover={{ bg: CHAIN_CARD_HOVER }}
      transition="background 0.15s"
    >
      <Box>
        <Text fontWeight={ 600 } color="text.primary" fontSize="sm">
          { chain.name }
        </Text>
        <Text fontSize="xs" color="text.secondary" fontFamily="mono">
          { chain.id.slice(0, 10) }...
        </Text>
      </Box>
      <Flex align="center" gap={ 2 }>
        <Tag size="sm" variant="subtle">L1</Tag>
        <Text color="text.secondary" fontSize="sm">{ '\u2192' }</Text>
      </Flex>
    </Flex>
  );

  if (explorerUrl) {
    return <Link href={ explorerUrl } variant="plain" target="_blank">{ content }</Link>;
  }

  return (
    <Link href={ `/chains/${ slug }` } variant="plain">{ content }</Link>
  );
};

const NetworkOverview = () => {
  const isMobile = useIsMobile();
  const { stats, isLoading: validatorsLoading } = useCurrentValidators();
  const { blockchains, isLoading: chainsLoading } = useBlockchains();

  const l1Chains = React.useMemo(
    () => blockchains.filter((c) => c.subnetID !== PRIMARY_NETWORK_ID),
    [ blockchains ],
  );

  const totalChains = PRIMARY_CHAINS.length + l1Chains.length;
  const isLoading = validatorsLoading || chainsLoading;

  return (
    <Box as="main">
      <HeroBanner/>

      <Flex
        justify="space-around"
        align="center"
        py={ 4 }
        px={{ base: 4, lg: 6 }}
        mt={ 4 }
        borderRadius="lg"
        border="1px solid"
        borderColor="border.divider"
        bgColor={ STAT_CARD_BG }
        gap={ 4 }
        flexWrap="wrap"
      >
        <NetworkStat label="Total Chains" value={ String(totalChains) } isLoading={ isLoading }/>
        <Box w="1px" h="32px" bgColor="border.divider" display={{ base: 'none', lg: 'block' }}/>
        <NetworkStat label="Validators" value={ String(stats.validatorCount) } isLoading={ isLoading }/>
        <Box w="1px" h="32px" bgColor="border.divider" display={{ base: 'none', lg: 'block' }}/>
        <NetworkStat
          label="Total Stake"
          value={ `${ formatStake(stats.totalStake) } LUX` }
          isLoading={ isLoading }
        />
        <Box w="1px" h="32px" bgColor="border.divider" display={{ base: 'none', lg: 'block' }}/>
        <NetworkStat
          label="Avg Uptime"
          value={ `${ stats.averageUptime.toFixed(1) }%` }
          isLoading={ isLoading }
        />
        <Box w="1px" h="32px" bgColor="border.divider" display={{ base: 'none', lg: 'block' }}/>
        <NetworkStat
          label="Connected"
          value={ `${ stats.connectedCount }/${ stats.validatorCount }` }
          isLoading={ isLoading }
        />
      </Flex>

      <Flex mt={ 6 } gap={ 6 } flexDir={{ base: 'column', lg: 'row' }}>
        <Stats/>
        <LatestBlocks/>
      </Flex>

      <Box mt={ 6 }>
        <Transactions/>
      </Box>

      <Grid
        templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
        gap={{ base: 6, lg: 8 }}
        mt={ 8 }
      >
        <Box>
          <Flex align="center" justify="space-between" mb={ 3 }>
            <Heading level="3">Primary Network</Heading>
            <Tag size="sm" variant="subtle">{ PRIMARY_CHAINS.length }</Tag>
          </Flex>
          <Flex direction="column" gap={ 2 }>
            { PRIMARY_CHAINS.map((chain) => (
              <ChainCard
                key={ chain.id }
                name={ chain.name }
                fullName={ chain.fullName }
                vm={ chain.vm }
                href={ chain.href }
              />
            )) }
          </Flex>
        </Box>

        <Box>
          <Flex align="center" justify="space-between" mb={ 3 }>
            <Heading level="3">L1 Chains</Heading>
            <Skeleton loading={ chainsLoading }>
              <Tag size="sm" variant="subtle">{ l1Chains.length }</Tag>
            </Skeleton>
          </Flex>
          { chainsLoading && (
            <Flex direction="column" gap={ 2 }>
              { Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={ i } loading h="68px" borderRadius="md"/>
              )) }
            </Flex>
          ) }
          { !chainsLoading && l1Chains.length === 0 && (
            <Text color="text.secondary" fontSize="sm" py={ 4 }>
              No L1 chains registered yet.
            </Text>
          ) }
          { !chainsLoading && l1Chains.length > 0 && (
            <Flex direction="column" gap={ 2 }>
              { l1Chains.map((chain) => (
                <L1ChainCard key={ chain.id } chain={ chain }/>
              )) }
            </Flex>
          ) }

          { !isMobile && (
            <Flex justify="center" mt={ 4 }>
              <Link href="/chains" textStyle="sm">View all chains</Link>
            </Flex>
          ) }
        </Box>
      </Grid>
    </Box>
  );
};

export default React.memo(NetworkOverview);
