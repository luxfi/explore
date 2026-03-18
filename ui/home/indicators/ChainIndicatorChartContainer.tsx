import React from 'react';

import type { TimeChartData } from 'toolkit/components/charts/types';

import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ChainIndicatorChartContent from './ChainIndicatorChartContent';

type Props = {
  data: TimeChartData;
  isError: boolean;
  isPending: boolean;
};

const ChainIndicatorChartContainer = ({ data, isError, isPending }: Props) => {

  if (isPending) {
    return <ContentLoader mt="auto" fontSize="xs"/>;
  }

  if (isError) {
    return <DataFetchAlert fontSize="xs"/>;
  }

  if (data[0].items.length === 0) {
    return <span fontSize="xs">no data</span>;
  }

  return (
    <div mx="-10px" my="-5px" h="calc(100% + 10px)" w="calc(100% + 20px)">
      <ChainIndicatorChartContent data={ data }/>
    </div>
  );
};

export default React.memo(ChainIndicatorChartContainer);
