import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';

interface ChainRowProps {
  readonly name: string;
  readonly fullName?: string;
  readonly blockchainId?: string;
  readonly subnetId?: string;
  readonly vmId?: string;
  readonly vmLabel?: string;
  readonly chainId?: number | null;
  readonly isActive?: boolean;
  readonly isLoading?: boolean;
}

const TRUNCATE_PREFIX_LEN = 8;
const TRUNCATE_SUFFIX_LEN = 4;

function truncateId(id: string): string {
  if (id.length <= TRUNCATE_PREFIX_LEN + TRUNCATE_SUFFIX_LEN + 3) {
    return id;
  }
  return `${ id.slice(0, TRUNCATE_PREFIX_LEN) }...${ id.slice(-TRUNCATE_SUFFIX_LEN) }`;
}

const ChainRow = ({
  name,
  fullName,
  blockchainId,
  subnetId,
  vmLabel,
  chainId,
  isActive = true,
  isLoading = false,
}: ChainRowProps) => {
  return (
    <Skeleton loading={ isLoading }>
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
        { /* Name column */ }
        <Flex
          direction="column"
          minW={{ base: '100%', lg: '180px' }}
          maxW={{ base: '100%', lg: '220px' }}
          flexShrink={ 0 }
        >
          <Box
            fontWeight="600"
            fontSize="sm"
            color="text.primary"
          >
            { name }
          </Box>
          { fullName && (
            <Box
              fontSize="xs"
              color="text.secondary"
              mt={ 0.5 }
            >
              { fullName }
            </Box>
          ) }
        </Flex>

        { /* Blockchain ID column */ }
        <Box
          flex={ 1 }
          minW={ 0 }
          fontFamily="mono"
          fontSize="sm"
          color="text.secondary"
          title={ blockchainId }
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          { blockchainId ? truncateId(blockchainId) : '\u2014' }
        </Box>

        { /* Subnet ID column */ }
        <Box
          flex={ 1 }
          minW={ 0 }
          fontFamily="mono"
          fontSize="sm"
          color="text.secondary"
          title={ subnetId }
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          display={{ base: 'none', lg: 'block' }}
        >
          { subnetId ? truncateId(subnetId) : '\u2014' }
        </Box>

        { /* VM badge */ }
        <Flex alignItems="center" gap={ 2 } flexShrink={ 0 }>
          { vmLabel && (
            <Box
              bgColor={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
              color="text.secondary"
              borderRadius="sm"
              px={ 2 }
              py={ 0.5 }
              fontSize="xs"
              fontFamily="mono"
              whiteSpace="nowrap"
            >
              { vmLabel }
            </Box>
          ) }
          { chainId != null && (
            <Box
              bgColor={{ _light: 'gray.100', _dark: 'whiteAlpha.100' }}
              color="text.secondary"
              borderRadius="sm"
              px={ 2 }
              py={ 0.5 }
              fontSize="xs"
              fontFamily="mono"
              whiteSpace="nowrap"
            >
              { chainId }
            </Box>
          ) }
        </Flex>

        { /* Status indicator */ }
        <Flex alignItems="center" flexShrink={ 0 } ml={{ base: 0, lg: 'auto' }}>
          <Box
            bgColor={ isActive ? 'green.400' : 'gray.400' }
            borderRadius="full"
            boxSize="8px"
          />
        </Flex>
      </Flex>
    </Skeleton>
  );
};

export default React.memo(ChainRow);
