import { upperFirst } from 'es-toolkit';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import getNetworkUtilizationParams from 'lib/networks/getNetworkUtilizationParams';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { nbsp } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';
import Pagination from 'ui/shared/pagination/Pagination';

interface Props {
  pagination: PaginationParams | null;
}

const BlocksTabSlot = ({ pagination }: Props) => {
  const statsQuery = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const networkUtilization = getNetworkUtilizationParams(statsQuery.data?.network_utilization_percentage ?? 0);

  return (
    <div alignItems="center" columnGap={ 8 } display={{ base: 'none', lg: 'flex' }}>
      { statsQuery.data?.network_utilization_percentage !== undefined && (
        <div>
          <span fontSize="sm">
            Network utilization (last 50 blocks):{ nbsp }
          </span>
          <Tooltip content={ `${ upperFirst(networkUtilization.load) } load` }>
            <Skeleton display="inline-block" color={ networkUtilization.color } fontWeight={ 600 } loading={ statsQuery.isPlaceholderData } className="text-sm">
              <span>{ statsQuery.data.network_utilization_percentage.toFixed(2) }%</span>
            </Skeleton>
          </Tooltip>
        </div>
      ) }
      <Link href={ route({ pathname: '/block/countdown' }) }>
        <IconSvg name="hourglass" boxSize={ 5 } mr={ 2 }/>
        <span>Block countdown</span>
      </Link>
      { pagination && <Pagination className="my-1" { ...pagination }/> }
    </div>
  );
};

export default BlocksTabSlot;
