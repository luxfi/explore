import React from 'react';

import type { GasPrices } from 'types/api/stats';

import GasTrackerPriceSnippet from './GasTrackerPriceSnippet';

interface Props {
  prices: GasPrices;
  isLoading: boolean;
}

const GasTrackerPrices = ({ prices, isLoading }: Props) => {
  return (
    <ul className="flex flex-col lg:flex-row border-2 border-gray-200 dark:border-white/30 rounded-xl overflow-hidden">
      { prices.fast && <GasTrackerPriceSnippet type="fast" data={ prices.fast } isLoading={ isLoading }/> }
      { prices.average && <GasTrackerPriceSnippet type="average" data={ prices.average } isLoading={ isLoading }/> }
      { prices.slow && <GasTrackerPriceSnippet type="slow" data={ prices.slow } isLoading={ isLoading }/> }
    </ul>
  );
};

export default React.memo(GasTrackerPrices);
