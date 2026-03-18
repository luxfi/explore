import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { ClustersByAddressResponse } from 'types/api/clusters';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import {
  filterOwnedClusters,
  getTotalRecordsDisplay,
  getClusterLabel,
  getClustersToShow,
  getGridRows,
  hasMoreClusters,
} from 'lib/clusters/clustersUtils';
import { Button } from '@luxfi/ui/button';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import ClustersEntity from 'ui/shared/entities/clusters/ClustersEntity';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  query: UseQueryResult<ClustersByAddressResponse, ResourceError<unknown>>;
  addressHash: string;
}

interface ClustersGridProps {
  data: ClustersByAddressResponse['result']['data'];
}

const ClustersGrid = ({ data }: ClustersGridProps) => {
  const itemsToShow = getClustersToShow(data, 10);
  const numberOfRows = getGridRows(itemsToShow.length, 5);

  return (
    <div className="grid gap-4 mt-2" style={{ gridTemplateRows: `repeat(${ numberOfRows }, auto)`, gridAutoFlow: 'column' }}>
      { itemsToShow.map((cluster) => (
        <ClustersEntity key={ cluster.name } clusterName={ cluster.name } className="font-semibold" noCopy/>
      )) }
    </div>
  );
};

const AddressClusters = ({ query, addressHash }: Props) => {
  const { data, isPending, isError } = query;

  const popover = useDisclosure();

  if (isError) {
    return null;
  }

  if (isPending) {
    return <Skeleton loading h={ 8 } w={{ base: '50px', xl: '120px' }} borderRadius="base"/>;
  }

  if (!data?.result?.data || data.result.data.length === 0) {
    return null;
  }

  const ownedClusters = filterOwnedClusters(data.result.data, addressHash);

  if (ownedClusters.length === 0) {
    return null;
  }

  const totalRecords = getTotalRecordsDisplay(ownedClusters.length);
  const clusterLabel = getClusterLabel(ownedClusters.length);
  const showMoreLink = hasMoreClusters(ownedClusters.length, 10);

  return (
    <PopoverRoot open={ popover.open } onOpenChange={ popover.onOpenChange }>
      <Tooltip content="List of clusters registered to this address" disabled={ popover.open } disableOnMobile closeOnClick>
        <div>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="dropdown"
              aria-label="Address clusters"
              fontWeight={ 500 }
              flexShrink={ 0 }
              columnGap={ 1 }
              role="group"
            >
              <IconSvg name="clusters" className="w-5 h-5 fill-current"/>
              <span className="hidden xl:inline">{ totalRecords } { clusterLabel }</span>
              <span className="xl:hidden">{ totalRecords }</span>
            </Button>
          </PopoverTrigger>
        </div>
      </Tooltip>
      <PopoverContent w={{ lg: '500px' }}>
        <PopoverBody textStyle="sm" display="flex" flexDir="column" rowGap={ 5 } alignItems="flex-start">
          <div>
            <span className="text-[var(--color-text-secondary)] text-xs">Attached to this address</span>
            <ClustersGrid data={ ownedClusters }/>
          </div>
          { showMoreLink && (
            <Link
              href={ route({ pathname: '/name-services', query: { q: addressHash, tab: 'directories' } }) }
            >
              <span>More results</span>
              <span className="text-[var(--color-text-secondary)]"> ({ totalRecords })</span>
            </Link>
          ) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default AddressClusters;
