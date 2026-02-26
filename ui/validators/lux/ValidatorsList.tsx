import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { PChainValidator } from 'lib/api/pchain';
import { Input } from 'toolkit/chakra/input';
import { Skeleton } from 'toolkit/chakra/skeleton';

import { formatStake, formatUptime, truncateNodeId } from './utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ValidatorsListProps {
  readonly validators: ReadonlyArray<PChainValidator>;
  readonly isLoading: boolean;
}

const ValidatorsList = ({ validators, isLoading }: ValidatorsListProps) => {
  const [ search, setSearch ] = React.useState('');

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [],
  );

  // Sort by stake desc, then filter by search
  const filtered = React.useMemo(() => {
    const sorted = [ ...validators ].sort((a, b) => {
      const aStake = BigInt(a.stakeAmount);
      const bStake = BigInt(b.stakeAmount);
      if (bStake > aStake) return 1;
      if (bStake < aStake) return -1;
      return 0;
    });

    if (!search.trim()) {
      return sorted;
    }

    const term = search.trim().toLowerCase();
    return sorted.filter((v) => v.nodeID.toLowerCase().includes(term));
  }, [ validators, search ]);

  return (
    <Flex direction="column" gap={ 4 }>
      { /* Search */ }
      <Box maxW="400px">
        <Input
          placeholder="Search by Node ID..."
          value={ search }
          onChange={ handleSearchChange }
          border="1px solid"
          borderColor="border.divider"
          borderRadius="md"
          bgColor="transparent"
          color="text.primary"
          size="md"
        />
      </Box>

      { /* Table */ }
      <Box
        border="1px solid"
        borderColor="border.divider"
        borderRadius="lg"
        overflow="hidden"
      >
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
            Stake Amount
          </Box>
          <Box
            w="120px" flexShrink={ 0 } color="text.secondary" fontWeight="600"
            fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="right"
          >
            Delegation Fee
          </Box>
          <Box
            w="100px" flexShrink={ 0 } color="text.secondary" fontWeight="600"
            fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="right"
          >
            Delegators
          </Box>
          <Box
            w="80px" flexShrink={ 0 } color="text.secondary" fontWeight="600"
            fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="center"
          >
            Connected
          </Box>
          <Box
            w="80px" flexShrink={ 0 } color="text.secondary" fontWeight="600"
            fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="right"
          >
            Uptime
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

        { /* Empty state */ }
        { !isLoading && filtered.length === 0 && (
          <Box px={ 4 } py={ 8 } textAlign="center" color="text.secondary" fontSize="sm">
            { search.trim() ? 'No validators match your search' : 'No validators found' }
          </Box>
        ) }

        { /* Rows */ }
        { !isLoading && filtered.map((v) => (
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
              { formatStake(v.stakeAmount) } LUX
            </Box>
            <Box w={{ base: 'auto', lg: '120px' }} flexShrink={ 0 } fontSize="sm" color="text.secondary" textAlign={{ base: 'left', lg: 'right' }}>
              { v.delegationFee }%
            </Box>
            <Box w={{ base: 'auto', lg: '100px' }} flexShrink={ 0 } fontSize="sm" color="text.secondary" textAlign={{ base: 'left', lg: 'right' }}>
              { v.delegators?.length ?? 0 }
            </Box>
            <Flex w={{ base: 'auto', lg: '80px' }} flexShrink={ 0 } justifyContent={{ base: 'flex-start', lg: 'center' }} alignItems="center">
              <Box
                bgColor={ v.connected ? 'green.400' : 'red.400' }
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
    </Flex>
  );
};

export default React.memo(ValidatorsList);
