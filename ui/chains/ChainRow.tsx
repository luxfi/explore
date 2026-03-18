import React from 'react';

import { Link } from 'toolkit/chakra/link';
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
  readonly href?: string;
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
  href,
}: ChainRowProps) => {
  const row = (
    <Skeleton loading={ isLoading }>
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
        cursor={ href ? 'pointer' : 'default' }
      >
        { /* Name column */ }
        <div
          direction="column"
          minW={{ base: '100%', lg: '180px' }}
          maxW={{ base: '100%', lg: '220px' }}
          flexShrink={ 0 }
        >
          <div fontWeight="600" fontSize="sm" color="text.primary">
            { name }
          </div>
          { fullName && (
            <div fontSize="xs" color="text.secondary" mt={ 0.5 }>
              { fullName }
            </div>
          ) }
        </div>

        { /* Blockchain ID column */ }
        <div
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
        </div>

        { /* Subnet ID column */ }
        <div
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
        </div>

        { /* VM badge */ }
        <div alignItems="center" gap={ 2 } flexShrink={ 0 }>
          { vmLabel && (
            <div
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
            </div>
          ) }
          { chainId != null && (
            <div
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
            </div>
          ) }
        </div>

        { /* Status indicator + arrow */ }
        <div alignItems="center" gap={ 2 } flexShrink={ 0 } ml={{ base: 0, lg: 'auto' }}>
          <div
            bgColor={ isActive ? 'green.400' : 'gray.400' }
            borderRadius="full"
            boxSize="8px"
          />
          { href && (
            <div color="text.secondary" fontSize="sm">{ '\u2192' }</div>
          ) }
        </div>
      </div>
    </Skeleton>
  );

  if (href) {
    return <Link href={ href } variant="plain">{ row }</Link>;
  }

  return row;
};

export default React.memo(ChainRow);
