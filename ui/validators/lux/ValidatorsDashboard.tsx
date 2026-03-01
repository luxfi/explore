import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { PChainValidator, ValidatorStats } from 'lib/api/pchain';
import { Skeleton } from 'toolkit/chakra/skeleton';

import { formatStake, formatUptime, truncateNodeId } from './utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOP_VALIDATORS_COUNT = 20;
const PERCENTAGE_SCALE = 100;

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

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
    bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.50' }}
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

// ---------------------------------------------------------------------------
// Stake breakdown
// ---------------------------------------------------------------------------

interface StakeBreakdownProps {
  readonly stats: ValidatorStats;
  readonly isLoading: boolean;
}

const StakeBreakdown = ({ stats, isLoading }: StakeBreakdownProps) => {
  const validatorStake = stats.totalStake - stats.totalDelegatedStake;
  const totalNumber = Number(stats.totalStake);
  const validatorPct = totalNumber > 0 ?
    (Number(validatorStake) / totalNumber * PERCENTAGE_SCALE).toFixed(1) :
    '0';
  const delegationPct = totalNumber > 0 ?
    (Number(stats.totalDelegatedStake) / totalNumber * PERCENTAGE_SCALE).toFixed(1) :
    '0';

  return (
    <Box
      border="1px solid"
      borderColor="border.divider"
      borderRadius="lg"
      p={ 5 }
      bgColor={{ _light: 'gray.50', _dark: 'whiteAlpha.50' }}
    >
      <Box fontSize="xs" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing="wider" mb={ 1 }>
        Total Stake
      </Box>
      <Skeleton loading={ isLoading }>
        <Box fontSize="2xl" fontWeight="700" color="text.primary" mb={ 3 }>
          { formatStake(stats.totalStake) } LUX
        </Box>
      </Skeleton>
      <Skeleton loading={ isLoading }>
        <Flex gap={ 4 } fontSize="sm" color="text.secondary">
          <Box>Validators: { formatStake(validatorStake) } LUX ({ validatorPct }%)</Box>
          <Box>Delegated: { formatStake(stats.totalDelegatedStake) } LUX ({ delegationPct }%)</Box>
        </Flex>
      </Skeleton>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Active validators table (top N)
// ---------------------------------------------------------------------------

interface ActiveValidatorsTableProps {
  readonly validators: ReadonlyArray<PChainValidator>;
  readonly isLoading: boolean;
}

const ActiveValidatorsTable = ({ validators, isLoading }: ActiveValidatorsTableProps) => {
  const sorted = React.useMemo(
    () => [ ...validators ].sort((a, b) => {
      const aStake = BigInt(a.stakeAmount ?? a.weight);
      const bStake = BigInt(b.stakeAmount ?? b.weight);
      if (bStake > aStake) return 1;
      if (bStake < aStake) return -1;
      return 0;
    }).slice(0, TOP_VALIDATORS_COUNT),
    [ validators ],
  );

  return (
    <Box
      border="1px solid"
      borderColor="border.divider"
      borderRadius="lg"
      overflow="hidden"
    >
      <Box px={ 4 } py={ 3 } fontWeight="600" fontSize="sm" color="text.primary" borderBottom="1px solid" borderColor="border.divider">
        Active Validators (Top { TOP_VALIDATORS_COUNT })
      </Box>

      { /* Header */ }
      <Flex
        px={ 4 }
        py={ 2 }
        gap={ 4 }
        borderBottom="1px solid"
        borderColor="border.divider"
        display={{ base: 'none', lg: 'flex' }}
      >
        <Box w="320px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
          Node ID
        </Box>
        <Box flex={ 1 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="right">
          Stake
        </Box>
        <Box w="120px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="right">
          Delegation Fee
        </Box>
        <Box w="80px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="center">
          Connected
        </Box>
        <Box w="80px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="right">
          Uptime
        </Box>
      </Flex>

      { /* Rows */ }
      { isLoading && (
        <Box px={ 4 } py={ 6 }>
          <Skeleton loading h="16px" mb={ 3 }/>
          <Skeleton loading h="16px" mb={ 3 }/>
          <Skeleton loading h="16px"/>
        </Box>
      ) }

      { !isLoading && sorted.map((v) => (
        <Flex
          key={ v.nodeID }
          px={ 4 }
          py={ 3 }
          gap={ 4 }
          borderBottom="1px solid"
          borderColor="border.divider"
          alignItems="center"
          _hover={{ bg: { _light: 'gray.50', _dark: 'whiteAlpha.50' } }}
          transition="background 0.15s"
          flexWrap={{ base: 'wrap', lg: 'nowrap' }}
        >
          <Box
            w={{ base: '100%', lg: '320px' }}
            flexShrink={ 0 }
            fontFamily="mono"
            fontSize="sm"
            color="text.primary"
            title={ v.nodeID }
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            { truncateNodeId(v.nodeID) }
          </Box>
          <Box flex={ 1 } fontSize="sm" color="text.primary" textAlign={{ base: 'left', lg: 'right' }}>
            { formatStake(v.stakeAmount ?? v.weight) } LUX
          </Box>
          <Box w={{ base: 'auto', lg: '120px' }} flexShrink={ 0 } fontSize="sm" color="text.secondary" textAlign={{ base: 'left', lg: 'right' }}>
            { v.delegationFee }%
          </Box>
          <Flex w={{ base: 'auto', lg: '80px' }} flexShrink={ 0 } justifyContent={{ base: 'flex-start', lg: 'center' }} alignItems="center">
            <Box
              bgColor={ v.connected !== false ? 'green.400' : 'red.400' }
              borderRadius="full"
              boxSize="8px"
            />
          </Flex>
          <Box w={{ base: 'auto', lg: '80px' }} flexShrink={ 0 } fontSize="sm" color="text.secondary" textAlign={{ base: 'left', lg: 'right' }}>
            { formatUptime(v.uptime) }
          </Box>
        </Flex>
      )) }
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

interface ValidatorsDashboardProps {
  readonly validators: ReadonlyArray<PChainValidator>;
  readonly stats: ValidatorStats;
  readonly isLoading: boolean;
}

const ValidatorsDashboard = ({ validators, stats, isLoading }: ValidatorsDashboardProps) => {
  return (
    <Flex direction="column" gap={ 6 }>
      { /* Stat cards */ }
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr 1fr', lg: 'repeat(4, 1fr)' }}
        gap={ 3 }
      >
        <StatCard
          label="Validators"
          value={ stats.validatorCount.toLocaleString() }
          isLoading={ isLoading }
        />
        <StatCard
          label="Connected"
          value={ `${ stats.connectedCount }/${ stats.validatorCount }` }
          isLoading={ isLoading }
        />
        <StatCard
          label="Delegators"
          value={ stats.delegatorCount.toLocaleString() }
          isLoading={ isLoading }
        />
        <StatCard
          label="Avg Uptime"
          value={ `${ stats.averageUptime.toFixed(1) }%` }
          isLoading={ isLoading }
        />
      </Box>

      { /* Stake breakdown */ }
      <StakeBreakdown stats={ stats } isLoading={ isLoading }/>

      { /* Active validators table */ }
      <ActiveValidatorsTable validators={ validators } isLoading={ isLoading }/>
    </Flex>
  );
};

export default React.memo(ValidatorsDashboard);
