import React from 'react';

import type { TimeChartData } from '../types';

export interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TimeChartData;
  selectedIndexes?: Array<number>;
  onItemClick?: (index: number) => void;
}

export const ChartLegend = React.memo(({ data, selectedIndexes, onItemClick, ...props }: ChartLegendProps) => {
  const handleItemClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const itemIndex = (event.currentTarget as HTMLDivElement).getAttribute(
        'data-index',
      );
      onItemClick?.(Number(itemIndex));
    },
    [ onItemClick ],
  );

  return (
    <div className="flex gap-x-3" { ...props }>
      { data.map((item, index) => {
        const isSelected = selectedIndexes?.includes(index);
        const lineColor = (() => {
          const lineChart = item.charts.find((chart) => chart.type === 'line');
          const areaChart = item.charts.find((chart) => chart.type === 'area');
          return (
            lineChart?.color || areaChart?.gradient.startColor || 'transparent'
          );
        })();

        return (
          <div
            key={ item.name }
            data-index={ index }
            className="flex items-center gap-x-1 p-[2px] cursor-pointer"
            onClick={ handleItemClick }
          >
            <div
              className="w-2 h-2 rounded-full border-2 shrink-0"
              style={{
                backgroundColor: isSelected ? lineColor : 'transparent',
                borderColor: lineColor,
              }}
            />
            <span className="text-xs text-[var(--color-text-secondary)]">
              { item.name }
            </span>
          </div>
        );
      }) }
    </div>
  );
});
