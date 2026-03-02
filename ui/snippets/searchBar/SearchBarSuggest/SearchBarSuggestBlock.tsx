import React from 'react';

import type { ItemsProps } from './types';
import type * as multichain from 'types/client/multichainAggregator';
import type { SearchResultBlock } from 'types/client/search';

import highlightText from 'lib/highlightText';
import { Tag } from '@luxfi/ui/tag';
import * as BlockEntity from 'ui/shared/entities/block/BlockEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import Time from 'ui/shared/time/Time';

const SearchBarSuggestBlock = ({ data, isMobile, searchTerm, chainInfo }: ItemsProps<SearchResultBlock | multichain.QuickSearchResultBlock>) => {
  const icon = <BlockEntity.Icon chain={ chainInfo }/>;
  const shouldHighlightHash = data.block_hash?.toLowerCase() === searchTerm.toLowerCase();
  const isFutureBlock = 'timestamp' in data && data.timestamp === undefined;
  const hasOnlyHash = data.block_number === undefined && data.block_hash !== undefined;

  if (hasOnlyHash) {
    const hash = (
      <mark className="overflow-hidden whitespace-nowrap block">
        <HashStringShortenDynamic hash={ data.block_hash } noTooltip/>
      </mark>
    );
    return (
      <div className="flex items-center">
        { icon }
        { hash }
      </div>
    );
  }

  const blockNumber = (
    <span className="font-bold overflow-hidden whitespace-nowrap text-ellipsis">
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.block_number.toString(), searchTerm) }}/>
    </span>
  );
  const hash = data.block_hash && !isFutureBlock ? (
    <span className={ `text-[var(--color-text-secondary)] overflow-hidden whitespace-nowrap block ${ shouldHighlightHash ? '' : '' }` }>
      { shouldHighlightHash ? (
        <mark className="block"><HashStringShortenDynamic hash={ data.block_hash } noTooltip/></mark>
      ) : (
        <HashStringShortenDynamic hash={ data.block_hash } noTooltip/>
      ) }
    </span>
  ) : null;
  const date = 'timestamp' in data && data.timestamp && !isFutureBlock ? <Time timestamp={ data.timestamp } color="text.secondary" format="lll_s"/> : undefined;
  const futureBlockText = <span className="text-[var(--color-text-secondary)]">Learn estimated time for this block to be created.</span>;
  const blockType = 'block_type' in data ? data.block_type : undefined;

  if (isMobile) {
    return (
      <>
        <div className="flex items-center">
          { icon }
          { blockNumber }
          { blockType === 'reorg' && <Tag className="ml-auto">Reorg</Tag> }
          { blockType === 'uncle' && <Tag className="ml-auto">Uncle</Tag> }
        </div>
        { hash }
        { isFutureBlock ? futureBlockText : date }
      </>
    );
  }

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: '228px minmax(auto, max-content) auto' }}>
      <div className="flex items-center">
        { icon }
        { blockNumber }
      </div>
      <div className="flex gap-x-3 min-w-0 items-center">
        { blockType === 'reorg' && <Tag className="shrink-0">Reorg</Tag> }
        { blockType === 'uncle' && <Tag className="shrink-0">Uncle</Tag> }
        { isFutureBlock ? futureBlockText : hash }
      </div>
      { date && <span className="text-[var(--color-text-secondary)] text-end">{ date }</span> }
    </div>
  );
};

export default React.memo(SearchBarSuggestBlock);
