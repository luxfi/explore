import React from 'react';

import getNetworkUtilizationParams from 'lib/networks/getNetworkUtilizationParams';
import { Skeleton } from '@luxfi/ui/skeleton';
import { mdash } from 'toolkit/utils/htmlEntities';

interface Props {
  percentage: number;
  isLoading: boolean;
}

const GasTrackerNetworkUtilization = ({ percentage, isLoading }: Props) => {
  const { load, color } = getNetworkUtilizationParams(percentage);

  return (
    <Skeleton loading={ isLoading } className="whitespace-pre-wrap">
      <span>Network utilization </span>
      <span color={ color }>{ percentage.toFixed(2) }% { mdash } { load } load</span>
    </Skeleton>
  );
};

export default React.memo(GasTrackerNetworkUtilization);
