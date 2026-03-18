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
      return <span className="font-bold text-[30px] leading-[36px] opacity-40">{ mdash }</span>;
    }

    return (
      <span className="font-bold text-[30px] leading-[36px]">
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
        <IconSvg name="arrows/up-head" className={ `w-5 h-5 mr-1 ${ valueDiff < 0 ? 'rotate-180' : '' }` }/>
        <span className={ `font-semibold ${ valueDiff >= 0 ? 'text-green-500' : 'text-red-500' }` }>{ valueDiff }%</span>
      </Skeleton>
    );
  })();

  if (chartQuery.isError) {
    return <FallbackChart term={ title } className="h-[144px] lg:h-[184px]"/>;
  }

  return (
    <div className="grow flex flex-col">
      <Skeleton loading={ isLoading } display="flex" alignItems="center" w="fit-content" className="gap-1">
        <span className="font-medium">{ title }</span>
        { hint && <Hint label={ hint }/> }
      </Skeleton>
      <div className="mb-0 lg:mb-2 mt-1 flex items-end">
        { valueTitleElement }
        { valueDiffElement }
      </div>
      <div className="h-[80px] lg:h-[110px] flex items-start grow">
        <ChainIndicatorChartContainer { ...chartQuery } isPending={ isLoading }/>
      </div>
    </div>
  );
};

export default React.memo(ChainIndicatorsChart);
