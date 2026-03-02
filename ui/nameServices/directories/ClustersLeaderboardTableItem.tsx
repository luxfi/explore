import React from 'react';

import type { ClustersLeaderboardObject } from 'types/api/clusters';

import { Skeleton } from '@luxfi/ui/skeleton';
import { TableCell, TableRow } from '@luxfi/ui/table';
import ClustersEntity from 'ui/shared/entities/clusters/ClustersEntity';

interface Props {
  item: ClustersLeaderboardObject;
  isLoading?: boolean;
}

const ClustersLeaderboardTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          #{ item.rank }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <ClustersEntity clusterName={ item.name } isLoading={ isLoading } className="font-semibold"/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { item.nameCount }
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { (parseFloat(item.totalWeiAmount) / 1e18).toFixed(2) } ETH
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          { item.chainIds.length } { item.chainIds.length === 1 ? 'chain' : 'chains' }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ClustersLeaderboardTableItem);
