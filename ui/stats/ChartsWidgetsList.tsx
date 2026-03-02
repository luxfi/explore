import React, { useCallback, useState } from 'react';

import type * as stats from '@luxfi/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import replaceNativeCoinName from 'lib/stats/replaceNativeCoinName';
import { EmptyState } from '@luxfi/ui/empty-state';
import { Heading } from '@luxfi/ui/heading';
import { Skeleton } from '@luxfi/ui/skeleton';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import IconSvg from 'ui/shared/IconSvg';

import ChartsLoadingErrorAlert from './ChartsLoadingErrorAlert';
import ChartWidgetContainer from './ChartWidgetContainer';

type Props = {
  initialFilterQuery: string;
  isError: boolean;
  isPlaceholderData: boolean;
  charts?: Array<stats.LineChartSection>;
  interval: StatsIntervalIds;
  sections?: Array<stats.LineChartSection>;
  selectedSectionId: string;
};

const ChartsWidgetsList = ({ isError, isPlaceholderData, charts, interval, initialFilterQuery, sections, selectedSectionId }: Props) => {
  const [ isSomeChartLoadingError, setIsSomeChartLoadingError ] = useState(false);
  const hasCharts = sections?.some((section) => section.charts.length > 0);
  const hasDisplayedCharts = charts?.some((section) => section.charts.length > 0);
  const sectionRef = React.useRef<HTMLUListElement | null>(null);

  const shouldScrollToSection = Boolean(initialFilterQuery);

  React.useEffect(() => {
    if (shouldScrollToSection) {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ shouldScrollToSection ]);

  const { chain } = useMultichainContext() || {};
  const isGasTrackerEnabled = config.features.gasTracker.isEnabled;

  const homeStatsQuery = useApiQuery('general:stats', {
    queryOptions: {
      refetchOnMount: false,
      enabled: isGasTrackerEnabled,
    },
  });

  const handleChartLoadingError = useCallback(
    () => setIsSomeChartLoadingError(true),
    [ setIsSomeChartLoadingError ]);

  if (isError) {
    return <ChartsLoadingErrorAlert/>;
  }

  if (!hasDisplayedCharts) {
    const selectedSection = sections?.find((section) => section.id === selectedSectionId);
    return (
      <EmptyState
        type={ hasCharts ? 'query' : 'stats' }
        term={ hasCharts ? 'chart' : selectedSection?.title }
      />
    );
  }

  return (
    <div>
      { isSomeChartLoadingError && (
        <ChartsLoadingErrorAlert/>
      ) }

      <section ref={ sectionRef }>
        {
          charts?.map((section) => (
            <div
              key={ section.id }
            >
              <Skeleton loading={ isPlaceholderData } className="mb-3 lg:mb-4 inline-flex items-center gap-2" id={ section.id }>
                <Heading level="2" id={ section.id }>
                  { section.title }
                </Heading>
                { isGasTrackerEnabled && section.id === 'gas' && homeStatsQuery.data && homeStatsQuery.data.gas_prices && (
                  <GasInfoTooltip data={ homeStatsQuery.data } dataUpdatedAt={ homeStatsQuery.dataUpdatedAt }>
                    <IconSvg name="info" color="icon.secondary"/>
                  </GasInfoTooltip>
                ) }
              </Skeleton>

              <div
               
              >
                { section.charts.map((chart) => (
                  <ChartWidgetContainer
                    key={ chart.id }
                    id={ chart.id }
                    title={ replaceNativeCoinName(chart.title) }
                    description={ replaceNativeCoinName(chart.description) }
                    interval={ interval }
                    isPlaceholderData={ isPlaceholderData }
                    onLoadingError={ handleChartLoadingError }
                    href={{ pathname: '/stats/[id]', query: { id: chart.id, ...(chain?.id ? { chain_id: chain.id } : {}) } }}
                  />
                )) }
              </div>
            </div>
          ))
        }
      </section>
    </div>
  );
};

export default ChartsWidgetsList;
