import React from 'react';

import type { AxesConfigFn, Resolution, TimeChartData } from './types';

import { Link } from '@luxfi/ui/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { apos } from '../../utils/htmlEntities';
import { Chart } from './Chart';

export interface ChartWidgetContentProps {
  charts: TimeChartData;
  isLoading?: boolean;
  isError?: boolean;
  empty?: boolean;
  emptyText?: string;
  zoomRange?: [ Date, Date ];
  handleZoom: (range: [ Date, Date ]) => void;
  isEnlarged?: boolean;
  noAnimation?: boolean;
  resolution?: Resolution;
  axesConfig?: AxesConfigFn;
};

export const ChartWidgetContent = React.memo(({
  charts,
  isLoading,
  isError,
  empty,
  emptyText,
  zoomRange,
  handleZoom,
  isEnlarged,
  noAnimation,
  resolution,
  axesConfig,
}: ChartWidgetContentProps) => {
  if (isError) {
    return (
      <div className="flex items-center justify-center grow py-4">
        <span className="text-[var(--color-text-secondary)] text-sm text-center">
          { `The data didn${ apos }t load. Please, ` }
          <Link href={ window.document.location.href }>try to reload the page.</Link>
        </span>
      </div>
    );
  }

  if (isLoading) {
    return <Skeleton loading flexGrow={ 1 } w="100%"/>;
  }

  if (empty || charts.length === 0) {
    return (
      <div className="flex items-center justify-center grow">
        <span className="text-[var(--color-text-secondary)] text-sm">{ emptyText || 'No data' }</span>
      </div>
    );
  }

  return (
    <div className="grow max-w-full relative h-full">
      <Chart
        charts={ charts }
        zoomRange={ zoomRange }
        onZoom={ handleZoom }
        isEnlarged={ isEnlarged }
        noAnimation={ noAnimation }
        resolution={ resolution }
        axesConfig={ axesConfig }
      />
      { /* watermark disabled for white-label branding */ }
    </div>
  );
});
