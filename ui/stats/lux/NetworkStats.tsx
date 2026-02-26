// Network-level stats for Lux Network: validators, chains, stake, uptime.
// Displayed above the standard Blockscout chain stats on the stats page.

import { Box, Grid, Text } from '@chakra-ui/react';
import React from 'react';

import { useBlockchains, useCurrentValidators } from 'lib/api/pchain';
import { Skeleton } from 'toolkit/chakra/skeleton';

// ── Constants ──

const PRIMARY_NETWORK_ID = '11111111111111111111111111111111LpoYY';
const PRIMARY_CHAIN_COUNT = 14;
const LUX_DECIMALS = 9;

const STAT_BG = { _light: 'gray.50', _dark: 'whiteAlpha.50' };

// ── Helpers ──

function formatStake(nanoLux: bigint): string {
  const lux = Number(nanoLux) / Math.pow(10, LUX_DECIMALS);
  if (lux >= 1_000_000) return `${ (lux / 1_000_000).toFixed(1) }M`;
  if (lux >= 1_000) return `${ (lux / 1_000).toFixed(1) }K`;
  return lux.toFixed(0);
}

// ── Stat card ──

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
    p={ 4 }
    bgColor={ STAT_BG }
  >
    <Text fontSize="xs" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={ 1 }>
      { label }
    </Text>
    <Skeleton loading={ isLoading }>
      <Text fontSize="xl" fontWeight="700" color="text.primary">
        { value }
      </Text>
    </Skeleton>
  </Box>
);

// ── Main component ──

const NetworkStats = () => {
  const { stats, isLoading: validatorsLoading } = useCurrentValidators();
  const { blockchains, isLoading: chainsLoading } = useBlockchains();

  const isLoading = validatorsLoading || chainsLoading;

  const l1Count = React.useMemo(
    () => blockchains.filter((c) => c.subnetID !== PRIMARY_NETWORK_ID).length,
    [ blockchains ],
  );

  const totalChains = PRIMARY_CHAIN_COUNT + l1Count;

  return (
    <Box mb={ 6 }>
      <Text fontSize="sm" fontWeight="600" color="text.secondary" textTransform="uppercase" letterSpacing="wider" mb={ 3 }>
        Network Overview
      </Text>
      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }}
        gap={ 3 }
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
          label="Connected"
          value={ `${ stats.connectedCount }/${ stats.validatorCount }` }
          isLoading={ isLoading }
        />
        <StatCard
          label="Total Stake"
          value={ `${ formatStake(stats.totalStake) } LUX` }
          isLoading={ isLoading }
        />
        <StatCard
          label="Avg Uptime"
          value={ `${ stats.averageUptime.toFixed(1) }%` }
          isLoading={ isLoading }
        />
      </Grid>
    </Box>
  );
};

export default React.memo(NetworkStats);
