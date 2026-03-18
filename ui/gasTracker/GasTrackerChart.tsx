import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { STATS_CHARTS_SECTION_GAS } from 'stubs/stats';
import { Link } from 'toolkit/next/link';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import ChartWidgetContainer from 'ui/stats/ChartWidgetContainer';

const GAS_PRICE_CHART_ID = 'averageGasPrice';

const GasTrackerChart = () => {
  const [ isChartLoadingError, setChartLoadingError ] = React.useState(false);
  const { data, isPlaceholderData, isError } = useApiQuery('stats:lines', {
    queryOptions: {
      placeholderData: {
        sections: [ STATS_CHARTS_SECTION_GAS ],
      },
    },
  });

  const handleLoadingError = React.useCallback(() => {
    setChartLoadingError(true);
  }, []);

  const chart = data?.sections.map((section) => section.charts.find((chart) => chart.id === GAS_PRICE_CHART_ID)).filter(Boolean)?.[0];

  const content = (() => {
    if (isPlaceholderData) {
      return <ContentLoader/>;
    }

    if (isChartLoadingError || isError) {
      return <DataFetchAlert/>;
    }

    if (!chart) {
      return null;
    }

    return (
      <ChartWidgetContainer
        id={ GAS_PRICE_CHART_ID }
        title={ chart.title }
        description={ chart.description }
        interval="oneMonth"
        isPlaceholderData={ isPlaceholderData }
        onLoadingError={ handleLoadingError }
        className="h-[320px]"
      />
    );
  })();

  if (!chart) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Gas price history</h3>
        <Link href={ route({ pathname: '/stats', hash: 'gas' }) }>Charts & stats</Link>
      </div>
      { content }
    </div>
  );
};

export default React.memo(GasTrackerChart);
