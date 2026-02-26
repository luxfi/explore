// Cross-chain bridge/teleporter page for the Lux multi-chain explorer.
// Shows cross-chain transfers between Primary Network chains and L1 subnets.

import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { useBlockchains, useCurrentValidators } from 'lib/api/pchain';
import type { PChainBlockchain } from 'lib/api/pchain';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import PageTitle from 'ui/shared/Page/PageTitle';

// ── Constants ──

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';

// All 14 primary network chains from ~/work/lux/node/node/vms_allvms.go
const CHAIN_LABELS: Readonly<Record<string, string>> = {
  C: 'C-Chain',
  P: 'P-Chain',
  X: 'X-Chain',
  D: 'D-Chain',
  A: 'A-Chain',
  B: 'B-Chain',
  Q: 'Q-Chain',
  T: 'T-Chain',
  Z: 'Z-Chain',
  G: 'G-Chain',
  K: 'K-Chain',
  O: 'O-Chain',
  R: 'R-Chain',
  I: 'I-Chain',
};

const STAT_CARD_BG = { _light: 'gray.50', _dark: 'whiteAlpha.50' };

// ── Sub-components ──

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

interface ChainPairCardProps {
  readonly source: string;
  readonly destination: string;
  readonly status: 'active' | 'coming_soon';
}

const ChainPairCard = ({ source, destination, status }: ChainPairCardProps) => (
  <Flex
    alignItems="center"
    py={ 3 }
    px={ 4 }
    borderBottom="1px solid"
    borderColor="border.divider"
    _hover={{ bg: { _light: 'gray.50', _dark: 'whiteAlpha.50' } }}
    transition="background 0.15s"
    gap={ 4 }
    flexWrap={{ base: 'wrap', lg: 'nowrap' }}
  >
    <Box minW="160px" flexShrink={ 0 }>
      <Text fontWeight="500" fontSize="sm" color="text.primary">
        { source }
      </Text>
    </Box>
    <Text color="text.secondary" fontSize="sm" flexShrink={ 0 }>
      { '\u2192' }
    </Text>
    <Box minW="160px" flexShrink={ 0 }>
      <Text fontWeight="500" fontSize="sm" color="text.primary">
        { destination }
      </Text>
    </Box>
    <Flex ml={{ base: 0, lg: 'auto' }} alignItems="center">
      { status === 'active' ? (
        <Tag size="sm" variant="subtle" colorPalette="green">Active</Tag>
      ) : (
        <Tag size="sm" variant="subtle">Coming Soon</Tag>
      ) }
    </Flex>
  </Flex>
);

// ── Main component ──

const BridgePage = () => {
  const { blockchains, isLoading: chainsLoading } = useBlockchains();
  const { stats, isLoading: validatorsLoading } = useCurrentValidators();

  const l1Chains = React.useMemo<ReadonlyArray<PChainBlockchain>>(
    () => blockchains.filter((c) => c.subnetID !== PRIMARY_NETWORK_ID),
    [ blockchains ],
  );

  const isLoading = chainsLoading || validatorsLoading;

  // Build bridge pairs: Primary chain <-> L1 subnets
  const bridgePairs = React.useMemo(() => {
    const pairs: Array<{ source: string; destination: string; status: 'active' | 'coming_soon' }> = [];

    // C-Chain <-> each L1
    for (const chain of l1Chains) {
      pairs.push({
        source: CHAIN_LABELS.C ?? 'C-Chain',
        destination: chain.name,
        status: 'coming_soon',
      });
      pairs.push({
        source: chain.name,
        destination: CHAIN_LABELS.C ?? 'C-Chain',
        status: 'coming_soon',
      });
    }

    // X-Chain <-> C-Chain (atomic swaps)
    pairs.unshift(
      { source: 'X-Chain', destination: 'C-Chain', status: 'active' },
      { source: 'C-Chain', destination: 'X-Chain', status: 'active' },
      { source: 'P-Chain', destination: 'C-Chain', status: 'active' },
      { source: 'C-Chain', destination: 'P-Chain', status: 'active' },
    );

    return pairs;
  }, [ l1Chains ]);

  return (
    <>
      <PageTitle
        title="Bridge"
        secondRow={ (
          <Box fontSize="sm" color="text.secondary">
            Cross-chain transfers between Lux Network chains
          </Box>
        ) }
      />

      { /* Stats */ }
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }}
        gap={ 3 }
        mb={ 6 }
      >
        <StatCard
          label="Connected Chains"
          value={ String(l1Chains.length + Object.keys(CHAIN_LABELS).length) }
          isLoading={ isLoading }
        />
        <StatCard
          label="Bridge Routes"
          value={ String(bridgePairs.length) }
          isLoading={ isLoading }
        />
        <StatCard
          label="Validators"
          value={ String(stats.validatorCount) }
          isLoading={ isLoading }
        />
        <StatCard
          label="Active Routes"
          value={ String(bridgePairs.filter((p) => p.status === 'active').length) }
          isLoading={ isLoading }
        />
      </Box>

      { /* Bridge routes table */ }
      <Box
        border="1px solid"
        borderColor="border.divider"
        borderRadius="lg"
        overflow="hidden"
      >
        <Box px={ 4 } py={ 3 } fontWeight="600" fontSize="sm" color="text.primary" borderBottom="1px solid" borderColor="border.divider">
          Bridge Routes
        </Box>

        { /* Table header */ }
        <Flex
          px={ 4 }
          py={ 2 }
          gap={ 4 }
          borderBottom="1px solid"
          borderColor="border.divider"
          display={{ base: 'none', lg: 'flex' }}
        >
          <Box minW="160px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
            Source
          </Box>
          <Box w="20px" flexShrink={ 0 }/>
          <Box minW="160px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
            Destination
          </Box>
          <Box ml="auto" color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
            Status
          </Box>
        </Flex>

        { /* Loading */ }
        { isLoading && (
          <Box px={ 4 } py={ 6 }>
            <Skeleton loading h="16px" mb={ 3 }/>
            <Skeleton loading h="16px" mb={ 3 }/>
            <Skeleton loading h="16px" mb={ 3 }/>
            <Skeleton loading h="16px"/>
          </Box>
        ) }

        { /* Routes */ }
        { !isLoading && bridgePairs.map((pair, idx) => (
          <ChainPairCard
            key={ `${ pair.source }-${ pair.destination }-${ idx }` }
            source={ pair.source }
            destination={ pair.destination }
            status={ pair.status }
          />
        )) }
      </Box>

      { /* Info card */ }
      <Box
        mt={ 6 }
        p={ 5 }
        border="1px solid"
        borderColor="border.divider"
        borderRadius="lg"
        bgColor={ STAT_CARD_BG }
      >
        <Text fontWeight="600" fontSize="sm" color="text.primary" mb={ 2 }>
          Lux Network Bridge
        </Text>
        <Text fontSize="sm" color="text.secondary" lineHeight="1.6">
          The Lux Bridge enables cross-chain asset transfers between the 14 Primary Network
          chains and L1 subnet chains. Atomic swaps between core chains (C, P, X) are
          currently active. Teleporter-based transfers to L1 subnets (Zoo, Hanzo, SPC, Pars)
          are coming soon via the B-Chain bridge relay.
        </Text>
      </Box>
    </>
  );
};

export default React.memo(BridgePage);
