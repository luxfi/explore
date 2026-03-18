import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import replaceNativeCoinName from 'lib/stats/replaceNativeCoinName';
import { STATS_COUNTER } from 'stubs/stats';
import StatsWidget from 'ui/shared/stats/StatsWidget';

import DataFetchAlert from '../shared/DataFetchAlert';

const UNITS_WITHOUT_SPACE = [ 's' ];

const NumberWidgetsList = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('stats:counters', {
    queryOptions: {
      placeholderData: { counters: Array(10).fill(STATS_COUNTER) },
    },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  return (
    <div
    >
      {
        data?.counters?.map(({ id, title, value, units, description }, index) => {

          let unitsStr = '';
          if (units && UNITS_WITHOUT_SPACE.includes(units)) {
            unitsStr = units;
          } else if (units) {
            unitsStr = ' ' + units;
          }

          const valueNum = Number(value);
          const maximumFractionDigits = valueNum < 10 ** -3 ? undefined : 3;

          return (
            <StatsWidget
              key={ id + (isPlaceholderData ? index : '') }
              label={ replaceNativeCoinName(title) }
              value={ Number(value).toLocaleString(undefined, { maximumFractionDigits, notation: 'compact' }) }
              valuePostfix={ replaceNativeCoinName(unitsStr) }
              isLoading={ isPlaceholderData }
              hint={ description }
            />
          );
        })
      }
    </div>
  );
};

export default NumberWidgetsList;
