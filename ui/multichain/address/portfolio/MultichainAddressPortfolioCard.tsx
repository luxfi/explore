import type BigNumber from 'bignumber.js';
import { clamp } from 'es-toolkit';
import React from 'react';

import type { ClusterChainConfig } from 'types/multichain';

import { cn } from 'lib/utils/cn';
import { Skeleton } from '@luxfi/ui/skeleton';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

import { formatPercentage } from './utils';

interface Props {
  chain: ClusterChainConfig;
  value: BigNumber;
  share?: number;
  isLoading: boolean;
  isSelected: boolean;
  noneIsSelected: boolean;
  totalNum?: number;
  onClick?: (chainId: string) => void;
}

const MultichainAddressPortfolioCard = ({ chain, value, share, isLoading, isSelected: isSelectedProp, noneIsSelected, totalNum, onClick }: Props) => {

  const isSelected = isSelectedProp || totalNum === 1;

  const columnNumDesktop = clamp(totalNum || 0, 3, 5);
  const cardWidth = React.useMemo(() => {
    return {
      base: (totalNum || 0) > 1 ? 'calc((100% - 8px) / 2)' : '100%',
      lg: `calc((100% - ${ (columnNumDesktop - 1) * 8 }px) / ${ columnNumDesktop })`,
    };
  }, [ totalNum, columnNumDesktop ]);

  const handleClick = React.useCallback(() => {
    chain.id && onClick?.(chain.id);
  }, [ chain.id, onClick ]);

  return (
    <div
      className={ cn(
        'p-3 rounded-[var(--radius-base,8px)] border text-xs',
        isSelected ? 'border-transparent bg-[var(--color-selected-control-bg)]' : 'border-[var(--color-border-divider)] bg-transparent',
        !isSelected && !noneIsSelected && 'opacity-50',
        onClick && 'cursor-pointer hover:border-[var(--color-hover)] hover:opacity-100',
        !onClick && 'cursor-default',
      ) }
      style={{ width: cardWidth.base }}
      onClick={ handleClick }
      aria-label={ `${ chain.name } portfolio selector` }
    >
      <ChainIcon data={ chain } boxSize="30px" flexShrink={ 0 } isLoading={ isLoading } noTooltip/>
      <div className="flex flex-col items-start gap-1 overflow-hidden">
        <TruncatedText text={ chain.name } loading={ isLoading } className="text-[var(--color-text-secondary)] max-w-full"/>
        <div className="flex gap-1 max-w-full">
          <SimpleValue value={ value } prefix="$" loading={ isLoading } noTooltip accuracy={ DEFAULT_ACCURACY_USD }/>
          { share !== undefined && share > 0 && (
            <Skeleton loading={ isLoading } color="text.secondary" flexShrink={ 0 }>
              <span>{ formatPercentage(share) }</span>
            </Skeleton>
          ) }
        </div>
      </div>
    </div>
  );
};

export default React.memo(MultichainAddressPortfolioCard);
