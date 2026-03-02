import React from 'react';

import type * as stats from '@luxfi/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';

import { createListCollection, Select } from '@luxfi/ui/select';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ChartIntervalSelect from 'ui/shared/chart/ChartIntervalSelect';

type Props = {
  sections?: Array<stats.LineChartSection>;
  currentSection: string;
  onSectionChange: (newSection: string) => void;
  interval: StatsIntervalIds;
  onIntervalChange: (newInterval: StatsIntervalIds) => void;
  onFilterInputChange: (q: string) => void;
  isLoading: boolean;
  initialFilterValue: string;
};

const StatsFilters = ({
  sections,
  currentSection,
  onSectionChange,
  interval,
  onIntervalChange,
  onFilterInputChange,
  isLoading,
  initialFilterValue,
}: Props) => {

  const collection = React.useMemo(() => {
    return createListCollection({
      items: [
        { value: 'all', label: 'All stats' },
        ...(sections || []).map((section) => ({ value: section.id, label: section.title })),
      ],
    });
  }, [ sections ]);

  const handleItemSelect = React.useCallback(({ value }: { value: Array<string> }) => {
    onSectionChange(value[0]);
  }, [ onSectionChange ]);

  return (
    <div
     
    >
      <div className="w-full lg:w-auto"
      >
        <Select
          collection={ collection }
          placeholder="Select section"
          defaultValue={ [ currentSection ] }
          onValueChange={ handleItemSelect }
          w={{ base: '100%', lg: '136px' }}
          loading={ isLoading }
        />
      </div>

      <div className="w-full lg:w-auto"
      >
        <ChartIntervalSelect interval={ interval } onIntervalChange={ onIntervalChange } isLoading={ isLoading } selectTagSize="md"/>
      </div>

      <div
       
      >
        <FilterInput
          key={ initialFilterValue }
          loading={ isLoading }
          onChange={ onFilterInputChange }
          placeholder="Find chart, metric..."
          initialValue={ initialFilterValue }
          size="sm"
        />
      </div>
    </div>
  );
};

export default StatsFilters;
