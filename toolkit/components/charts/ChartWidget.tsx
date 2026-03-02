import { range } from 'es-toolkit';
import React, { useRef } from 'react';

import type { AxesConfigFn, TimeChartData } from './types';

import RepeatIcon from 'icons/repeat.svg';
import { cn } from 'lib/utils/cn';

import { IconButton } from '@luxfi/ui/icon-button';
import { Link } from '@luxfi/ui/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import { ChartWidgetContent } from './ChartWidgetContent';
import { ChartLegend } from './parts/ChartLegend';
import type { ChartMenuItemId } from './parts/ChartMenu';
import ChartMenu from './parts/ChartMenu';
import { useChartZoom } from './utils/useChartZoom';

export interface ChartWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  charts: TimeChartData;
  title: string;
  description?: string;
  isLoading: boolean;
  isError: boolean;
  emptyText?: string;
  noAnimation?: boolean;
  href?: string;
  chartUrl?: string;
  axesConfig?: AxesConfigFn;
  menuItemIds?: Array<ChartMenuItemId>;
};

export const ChartWidget = React.memo(({
  charts,
  title,
  description,
  isLoading,
  isError,
  emptyText,
  noAnimation,
  href,
  chartUrl,
  axesConfig,
  menuItemIds,
  className,
  ...rest
}: ChartWidgetProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { zoomRange, handleZoom, handleZoomReset } = useChartZoom();

  const [ selectedCharts, setSelectedCharts ] = React.useState<Array<number>>(
    range(charts.length),
  );

  React.useEffect(() => {
    if (charts.length > 0) {
      setSelectedCharts(range(charts.length));
    }
  }, [ charts.length ]);

  const handleLegendItemClick = React.useCallback((index: number) => {
    setSelectedCharts((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }
      return [ ...prev, index ];
    });
  }, []);

  const displayedCharts = React.useMemo(() => {
    return charts.filter((_, index) => selectedCharts.includes(index));
  }, [ charts, selectedCharts ]);

  const hasNonEmptyCharts = charts.some(({ items }) => items && items.length > 2);
  const hasMenu = (() => {
    const hasIds = !(menuItemIds && menuItemIds.length === 0);
    if (!hasIds) {
      return false;
    }
    if (isError) {
      return false;
    }
    if (!hasNonEmptyCharts) {
      return false;
    }
    return true;
  })();

  const content = (
    <ChartWidgetContent
      charts={ displayedCharts }
      isError={ isError }
      isLoading={ isLoading }
      empty={ !hasNonEmptyCharts }
      emptyText={ emptyText }
      handleZoom={ handleZoom }
      zoomRange={ zoomRange }
      noAnimation={ noAnimation }
      axesConfig={ axesConfig }
    />
  );

  const chartHeader = (
    <div
      className={ cn(
        'flex grow flex-col items-start',
        href ? 'cursor-pointer hover:text-[var(--color-link-primary-hover)]' : 'cursor-default',
      ) }
    >
      <Skeleton
        loading={ isLoading }
        fontWeight={ 600 }
        textStyle="md"
      >
        <span>{ title }</span>
      </Skeleton>

      { description && (
        <Skeleton
          loading={ isLoading }
          color="text.secondary"
          textStyle="xs"
          mt={ 1 }
        >
          <span>{ description }</span>
        </Skeleton>
      ) }
    </div>
  );

  return (
    <div
      className={ cn(
        'h-full flex flex-col p-3 lg:p-4 rounded-lg border border-gray-200 dark:border-gray-600',
        className,
      ) }
      ref={ ref }
      { ...rest }
    >
      <div className="flex gap-x-6 mb-2 items-start">
        { href ? (
          <Link href={ href }>
            { chartHeader }
          </Link>
        ) : chartHeader }
        <div className="flex ml-auto gap-x-2">
          <Tooltip content="Reset zoom">
            <IconButton
              hidden={ !zoomRange }
              aria-label="Reset zoom"
              size="md"
              variant="icon_background"
              onClick={ handleZoomReset }
            >
              <RepeatIcon className="w-5 h-5"/>
            </IconButton>
          </Tooltip>

          { hasMenu && (
            <ChartMenu
              charts={ charts }
              itemIds={ menuItemIds }
              title={ title }
              description={ description }
              chartUrl={ chartUrl }
              isLoading={ isLoading }
              chartRef={ ref }
              handleZoom={ handleZoom }
              handleZoomReset={ handleZoomReset }
              zoomRange={ zoomRange }
            />
          ) }
        </div>
      </div>

      { content }

      { charts.length > 1 && (
        <ChartLegend
          data={ charts }
          selectedIndexes={ selectedCharts }
          onItemClick={ handleLegendItemClick }
        />
      ) }
    </div>
  );
});
