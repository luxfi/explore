import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { PChainDelegator, PChainValidator } from 'lib/api/pchain';
import dayjs from 'lib/date/dayjs';
import { Skeleton } from 'toolkit/chakra/skeleton';

import { formatStake, truncateNodeId } from './utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FlatDelegator extends PChainDelegator {
  readonly validatorNodeID: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TXID_PREFIX_LEN = 10;
const TXID_SUFFIX_LEN = 6;

function truncateTxId(txId: string): string {
  const minLength = TXID_PREFIX_LEN + TXID_SUFFIX_LEN + 3;
  if (txId.length <= minLength) {
    return txId;
  }
  return `${ txId.slice(0, TXID_PREFIX_LEN) }...${ txId.slice(-TXID_SUFFIX_LEN) }`;
}

function formatTimestamp(unixSeconds: string): string {
  const ts = Number(unixSeconds);
  if (ts === 0) {
    return '\u2014';
  }
  return dayjs.unix(ts).format('lll');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface DelegatorsListProps {
  readonly validators: ReadonlyArray<PChainValidator>;
  readonly isLoading: boolean;
}

const DelegatorsList = ({ validators, isLoading }: DelegatorsListProps) => {
  const delegators = React.useMemo<ReadonlyArray<FlatDelegator>>(() => {
    const result: Array<FlatDelegator> = [];
    for (const v of validators) {
      if (v.delegators) {
        for (const d of v.delegators) {
          result.push({ ...d, validatorNodeID: v.nodeID });
        }
      }
    }
    // Sort by stake descending
    result.sort((a, b) => {
      const aStake = BigInt(a.stakeAmount);
      const bStake = BigInt(b.stakeAmount);
      if (bStake > aStake) return 1;
      if (bStake < aStake) return -1;
      return 0;
    });
    return result;
  }, [ validators ]);

  return (
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
        <Box w="180px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
          TX ID
        </Box>
        <Box w="260px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
          Node ID
        </Box>
        <Box flex={ 1 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="right">
          Stake Amount
        </Box>
        <Box w="180px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
          Start
        </Box>
        <Box w="180px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider">
          End
        </Box>
        <Box w="120px" flexShrink={ 0 } color="text.secondary" fontWeight="600" fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="right">
          Potential Reward
        </Box>
      </Flex>

      { /* Loading */ }
      { isLoading && (
        <Box px={ 4 } py={ 6 }>
          <Skeleton loading h="16px" mb={ 3 }/>
          <Skeleton loading h="16px" mb={ 3 }/>
          <Skeleton loading h="16px"/>
        </Box>
      ) }

      { /* Empty state */ }
      { !isLoading && delegators.length === 0 && (
        <Box px={ 4 } py={ 8 } textAlign="center" color="text.secondary" fontSize="sm">
          No delegators found
        </Box>
      ) }

      { /* Rows */ }
      { !isLoading && delegators.map((d) => (
        <Flex
          key={ `${ d.txID }-${ d.validatorNodeID }` }
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
            w={{ base: '100%', lg: '180px' }}
            flexShrink={ 0 }
            fontFamily="mono"
            fontSize="sm"
            color="text.primary"
            title={ d.txID }
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            { truncateTxId(d.txID) }
          </Box>
          <Box
            w={{ base: '100%', lg: '260px' }}
            flexShrink={ 0 }
            fontFamily="mono"
            fontSize="sm"
            color="text.secondary"
            title={ d.validatorNodeID }
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            { truncateNodeId(d.validatorNodeID) }
          </Box>
          <Box flex={ 1 } fontSize="sm" color="text.primary" textAlign={{ base: 'left', lg: 'right' }}>
            { formatStake(d.stakeAmount) } LUX
          </Box>
          <Box w={{ base: 'auto', lg: '180px' }} flexShrink={ 0 } fontSize="xs" color="text.secondary">
            { formatTimestamp(d.startTime) }
          </Box>
          <Box w={{ base: 'auto', lg: '180px' }} flexShrink={ 0 } fontSize="xs" color="text.secondary">
            { formatTimestamp(d.endTime) }
          </Box>
          <Box w={{ base: 'auto', lg: '120px' }} flexShrink={ 0 } fontSize="sm" color="text.secondary" textAlign={{ base: 'left', lg: 'right' }}>
            { formatStake(d.potentialReward) } LUX
          </Box>
        </Flex>
      )) }
    </Box>
  );
};

export default React.memo(DelegatorsList);
