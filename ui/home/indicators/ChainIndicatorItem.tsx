import React from 'react';

import type { TChainIndicator } from './types';
import type { ChainIndicatorId } from 'types/homepage';

import { cn } from 'lib/utils/cn';
import { Skeleton } from '@luxfi/ui/skeleton';
import { mdash } from 'toolkit/utils/htmlEntities';
interface Props {
  indicator: TChainIndicator;
  isSelected: boolean;
  onClick: (id: ChainIndicatorId) => void;
  isLoading: boolean;
}

const ChainIndicatorItem = ({ indicator, isSelected, onClick, isLoading }: Props) => {
  const handleClick = React.useCallback(() => {
    onClick(indicator.id);
  }, [ indicator.id, onClick ]);

  const valueContent = (() => {
    if (indicator.value.includes('N/A')) {
      return <span className="opacity-40 font-normal">{ mdash }</span>;
    }

    return (
      <Skeleton loading={ isLoading } fontWeight={ 600 } minW="30px">
        { indicator.value }
      </Skeleton>
    );
  })();

  const valueDiffContent = (() => {
    if (indicator.valueDiff === undefined || (!isLoading && indicator.value.includes('N/A'))) {
      return null;
    }

    const diffColor = indicator.valueDiff >= 0 ? 'green.500' : 'red.500';

    return (
      <Skeleton loading={ isLoading } ml={ 1 } display="flex" alignItems="center" color={ diffColor }>
        <span>{ indicator.valueDiff >= 0 ? '+' : '-' }</span>
        <span className={ cn('font-semibold', indicator.valueDiff >= 0 ? 'text-green-500' : 'text-red-500') }>{ Math.abs(indicator.valueDiff) }%</span>
      </Skeleton>
    );
  })();

  return (
    <li
      className={ cn(
        'flex items-center gap-x-2 grow-0 lg:grow px-[6px] lg:px-2 py-[6px] rounded cursor-pointer text-xs font-medium',
        isSelected ? 'text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)]' : 'text-[var(--color-link-primary)]',
        'hover:bg-[var(--color-bg-primary)] hover:z-[1]',
        !isSelected && 'hover:text-[var(--color-link-primary-hover)]',
      ) }
      onClick={ handleClick }
    >
      { indicator.icon }
      <div className="hidden lg:block">
        <span>{ indicator.titleShort || indicator.title }</span>
        <div className="flex items-center text-[var(--color-text-primary)]">
          { valueContent }
          { valueDiffContent }
        </div>
      </div>
    </li>
  );
};

export default React.memo(ChainIndicatorItem);
