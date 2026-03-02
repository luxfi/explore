import React from 'react';

import type { CctxListItem } from '@luxfi/zetachain-cctx-types';

import { route } from 'nextjs/routes';

import { SECOND } from 'toolkit/utils/consts';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import Time from 'ui/shared/time/Time';

import SearchBarSuggestItemLink from './SearchBarSuggestItemLink';

interface Props {
  data: CctxListItem;
  isMobile: boolean | undefined;
  searchTerm: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SearchBarSuggestZetaChainCCTX = ({ data, isMobile, searchTerm, onClick }: Props) => {
  const icon = <IconSvg name="interop" className="w-5 h-5 mr-1 text-[var(--color-text-secondary)]"/>;

  // search term can be either cctx hash or observed hash (hash from another chain)
  const hash = (
    <span
      { ...(searchTerm === data.index ? { as: 'mark' } : {}) }
      className="overflow-hidden whitespace-nowrap font-bold"
    >
      <HashStringShortenDynamic hash={ data.index } noTooltip/>
    </span>
  );

  let content;

  if (isMobile) {
    content = (
      <>
        <div className="flex items-center">
          { icon }
          { hash }
        </div>
        <Time timestamp={ Number(data.last_update_timestamp) * SECOND } color="text.secondary" format="lll_s"/>
      </>
    );
  } else {
    content = (
      <div className="flex gap-x-2">
        <div className="flex items-center min-w-0">
          { icon }
          { hash }
        </div>
        <Time timestamp={ Number(data.last_update_timestamp) * SECOND } color="text.secondary" textAlign="end" flexShrink={ 0 } ml="auto" format="lll_s"/>
      </div>
    );
  }

  return (
    <SearchBarSuggestItemLink href={ route({ pathname: '/cc/tx/[hash]', query: { hash: data.index } }) } onClick={ onClick }>
      { content }
    </SearchBarSuggestItemLink>
  );
};

export default React.memo(SearchBarSuggestZetaChainCCTX);
