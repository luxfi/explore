import React from 'react';

import type { TChainIndicator } from './types';
import type { ChainIndicatorId } from 'types/homepage';

import ChainIndicatorItem from './ChainIndicatorItem';

interface Props {
  indicators: Array<TChainIndicator>;
  isLoading: boolean;
  selectedId: ChainIndicatorId;
  onItemClick: (id: ChainIndicatorId) => void;
}

const ChainIndicatorsList = ({ indicators, isLoading, selectedId, onItemClick }: Props) => {
  if (indicators.length < 2) {
    return null;
  }

  return (
    <ul
      className="shrink-0 flex flex-col rounded-lg gap-y-[6px] my-auto lg:m-0"
    >
      { indicators.map((indicator) => {
        return (
          <ChainIndicatorItem
            key={ indicator.id }
            indicator={ indicator }
            isSelected={ selectedId === indicator.id }
            onClick={ onItemClick }
            isLoading={ isLoading }
          />
        );
      }) }
    </ul>
  );
};

export default React.memo(ChainIndicatorsList);
