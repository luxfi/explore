// Cross-chain bridge/teleporter page for the Lux multi-chain explorer.
// Shows cross-chain transfers between Primary Network chains and L1 subnets.

import React from 'react';

import config from 'configs/app';
import { useBridgeData } from 'lib/api/bchain';
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

interface ChainPairCardProps {
  readonly source: string;
  readonly destination: string;
  readonly status: 'active' | 'coming_soon';
}

const ChainPairCard = ({ source, destination, status }: ChainPairCardProps) => (
  <div
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
    <div minW="160px" flexShrink={ 0 }>
      <span fontWeight="500" fontSize="sm" color="text.primary">
        { source }
      </span>
    </div>
    <span color="text.secondary" fontSize="sm" flexShrink={ 0 }>
      { '\u2192' }
    </span>
    <div minW="160px" flexShrink={ 0 }>
      <span fontWeight="500" fontSize="sm" color="text.primary">
        { destination }
      </span>
    </div>
    <div ml={{ base: 0, lg: 'auto' }} alignItems="center">
      { status === 'active' ? (
        <Tag size="sm" variant="subtle" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Tag>
      ) : (
        <Tag size="sm" variant="subtle">Coming Soon</Tag>
      ) }
    </div>
  </div>
);

// ── Main component ──

const BridgePage = () => {
  const { blockchains, isLoading: chainsLoading } = useBlockchains();
  const { stats, isLoading: validatorsLoading } = useCurrentValidators();
  const { stats: bridgeStats, isLoading: bridgeLoading } = useBridgeData();

  const l1Chains = React.useMemo<ReadonlyArray<PChainBlockchain>>(
    () => blockchains.filter((c) => c.subnetID !== PRIMARY_NETWORK_ID),
    [ blockchains ],
  );

  const isLoading = chainsLoading || validatorsLoading || bridgeLoading;

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
          <div fontSize="sm" color="text.secondary">
            Cross-chain transfers between { config.chain.name || 'network' } chains
          </div>
        ) }
      />

      { /* Stats */ }
      <div
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
          label="Bridge Signers"
          value={ bridgeStats.signerCount > 0 ? String(bridgeStats.signerCount) : String(stats.validatorCount) }
          isLoading={ isLoading }
        />
        <StatCard
          label="Active Routes"
          value={ String(bridgePairs.filter((p) => p.status === 'active').length) }
          isLoading={ isLoading }
        />
      </div>

      { /* Bridge routes table */ }
      <div
        border="1px solid"
        borderColor="border.divider"
        borderRadius="lg"
        overflow="hidden"
      >
        <div px={ 4 } py={ 3 } fontWeight="600" fontSize="sm" color="text.primary" borderBottom="1px solid" borderColor="border.divider">
          Bridge Routes
        </div>

        { /* Table header */ }
        <div
          px={ 4 }
          py={ 2 }
          gap={ 4 }
          borderBottom="1px solid"
          borderColor="border.divider"
          display={{ base: 'none', lg: 'flex' }}
        >
          <div minW="160px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
            Source
          </div>
          <div w="20px" flexShrink={ 0 }/>
          <div minW="160px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
            Destination
          </div>
          <div ml="auto" color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
            Status
          </div>
        </div>

        { /* Loading */ }
        { isLoading && (
          <div px={ 4 } py={ 6 }>
            <Skeleton loading h="16px" mb={ 3 }/>
            <Skeleton loading h="16px" mb={ 3 }/>
            <Skeleton loading h="16px" mb={ 3 }/>
            <Skeleton loading h="16px"/>
          </div>
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
      </div>

      { /* Info card */ }
      <div
        mt={ 6 }
        p={ 5 }
        border="1px solid"
        borderColor="border.divider"
        borderRadius="lg"
        bgColor={ STAT_CARD_BG }
      >
        <span fontWeight="600" fontSize="sm" color="text.primary" mb={ 2 }>
          { config.chain.name || 'Network' } Bridge
        </span>
        <span fontSize="sm" color="text.secondary" lineHeight="1.6">
          The bridge enables cross-chain asset transfers between the Primary Network
          chains and L1 subnet chains. Atomic swaps between core chains (C, P, X) are
          currently active. Teleporter-based transfers to L1 subnets are
          coming soon via the B-Chain bridge relay.
        </span>
      </div>
    </>
  );
};

export default React.memo(BridgePage);
