import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';
import { mdash } from 'toolkit/utils/htmlEntities';
import FallbackChart from 'ui/shared/fallbacks/FallbackChart';
import IconSvg from 'ui/shared/IconSvg';

import ChainIndicatorChartContainer from './ChainIndicatorChartContainer';
import type { UseFetchChartDataResult } from './useChartDataQuery';

interface Props {
  isLoading: boolean;
  value: string;
  valueDiff?: number;
  chartQuery: UseFetchChartDataResult;
  title: string;
  hint?: string;
}

const ChainIndicatorsChart = ({ isLoading: isLoadingProp, value, valueDiff, chartQuery, title, hint }: Props) => {
  const isLoading = isLoadingProp || chartQuery.isPending;

  const valueTitleElement = (() => {
    if (isLoading) {
      return <Skeleton loading h="36px" w="200px"/>;
    }

    if (value.includes('N/A')) {
      return <span fontWeight={ 700 } fontSize="30px" lineHeight="36px" opacity="control.disabled">{ mdash }</span>;
    }

    return (
      <span fontWeight={ 700 } fontSize="30px" lineHeight="36px">
        { value }
      </span>
    );
  })();

  const valueDiffElement = (() => {
    if (valueDiff === undefined || (!isLoading && value.includes('N/A'))) {
      return null;
    }

    const diffColor = valueDiff >= 0 ? 'green.500' : 'red.500';

    return (
      <Skeleton loading={ isLoading } display="flex" alignItems="center" color={ diffColor } ml={ 2 }>
        <IconSvg name="arrows/up-head" boxSize={ 5 } mr={ 1 } transform={ valueDiff < 0 ? 'rotate(180deg)' : 'rotate(0)' }/>
        <span color={ diffColor } fontWeight={ 600 }>{ valueDiff }%</span>
      </Skeleton>
    );
  })();

  if (chartQuery.isError) {
    return <FallbackChart term={ title } h={{ base: '144px', lg: '184px' }}/>;
  }

  return (
    <div flexGrow={ 1 } flexDir="column">
      <Skeleton loading={ isLoading } display="flex" alignItems="center" w="fit-content" className="gap-1">
        <span fontWeight={ 500 }>{ title }</span>
        { hint && <Hint label={ hint }/> }
      </Skeleton>
      <div mb={{ base: 0, lg: 2 }} mt={ 1 } alignItems="end">
        { valueTitleElement }
        { valueDiffElement }
      </div>
      <div h={{ base: '80px', lg: '110px' }} alignItems="flex-start" flexGrow={ 1 }>
        <ChainIndicatorChartContainer { ...chartQuery } isPending={ isLoading }/>
      </div>
    </div>
  );
};

export default React.memo(ChainIndicatorsChart);
