import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultTx } from 'types/api/search';
import type * as multichain from 'types/client/multichainAggregator';

import * as TxEntity from 'ui/shared/entities/tx/TxEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import Time from 'ui/shared/time/Time';

const SearchBarSuggestTx = ({ data, isMobile, chainInfo }: ItemsProps<SearchResultTx | multichain.QuickSearchResultTransaction>) => {
  const icon = <TxEntity.Icon chain={ chainInfo }/>;
  const hash = (
    <mark className="overflow-hidden whitespace-nowrap font-bold">
      <HashStringShortenDynamic hash={ data.transaction_hash } noTooltip/>
    </mark>
  );
  const date = 'timestamp' in data && data.timestamp ? <Time timestamp={ data.timestamp } format="lll_s"/> : undefined;

  if (isMobile) {
    return (
      <>
        <div className="flex items-center">
          { icon }
          { hash }
        </div>
        <span className="text-[var(--color-text-secondary)]">{ date }</span>
      </>
    );
  }

  return (
    <div className="flex gap-x-2">
      <div className="flex items-center min-w-0">
        { icon }
        { hash }
      </div>
      <span className="text-[var(--color-text-secondary)] text-end shrink-0 ml-auto">{ date }</span>
    </div>
  );
};

export default React.memo(SearchBarSuggestTx);
