import type { FC } from 'react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { HEX_REGEXP } from 'toolkit/utils/regexp';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import IconSvg from 'ui/shared/IconSvg';

import type { NovesFlowViewItem } from '../utils/generateFlowViewData';
import NovesTokenTooltipContent from './NovesTokenTooltipContent';

interface Props {
  item: NovesFlowViewItem;
  isLoaded: boolean;
}

const NovesActionSnippet: FC<Props> = ({ item, isLoaded }) => {
  const token = React.useMemo(() => {
    const action = item.action;

    const name = action.nft?.name || action.token?.name;
    const symbol = action.nft?.symbol || action.token?.symbol;

    const token = {
      name: name || '',
      symbol: (symbol?.toLowerCase() === name?.toLowerCase() ? undefined : symbol) || '',
      address_hash: action.nft?.address || action.token?.address || '',
      icon_url: '',
      type: action.nft ? 'ERC-721' as const : 'ERC-20' as const,
      reputation: null,
    };

    return token;
  }, [ item.action ]);

  const validTokenAddress = token.address_hash ? HEX_REGEXP.test(token.address_hash) : false;

  const tooltipContent = (
    <NovesTokenTooltipContent
      token={ item.action.token || item.action.nft }
      amount={ item.action.amount }
    />
  );

  return (
    <Skeleton loading={ !isLoaded }>
      <div className="lg:hidden">
        <span >
          { item.action.label }
        </span>
        <span>
          { item.action.amount }
        </span>
        <TokenEntity
          token={ token }
          noCopy
          noSymbol
          noLink={ !validTokenAddress }
          className="w-fit"
        />
      </div>

      <Tooltip
        content={ tooltipContent }
        openDelay={ 50 }
        closeDelay={ 50 }
        positioning={{ placement: 'bottom' }}
        interactive
      >
        <div className="hidden lg:block">
          <IconSvg
            name="lightning"
            className="h-5 w-5 text-[var(--color-icon-primary)]"
          />
          <span >
            { item.action.label }
          </span>
          <span>
            { item.action.amount }
          </span>
          <TokenEntity
            token={ token }
            noCopy
            jointSymbol
            noLink={ !validTokenAddress }
            className="w-fit"
          />
        </div>
      </Tooltip>
    </Skeleton>
  );
};

export default React.memo(NovesActionSnippet);
