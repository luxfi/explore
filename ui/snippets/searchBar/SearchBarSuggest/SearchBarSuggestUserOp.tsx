import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultUserOp } from 'types/api/search';

import * as UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import Time from 'ui/shared/time/Time';

const SearchBarSuggestUserOp = ({ data, isMobile }: ItemsProps<SearchResultUserOp>) => {
  const icon = <UserOpEntity.Icon/>;
  const hash = (
    <mark className="overflow-hidden whitespace-nowrap font-bold">
      <HashStringShortenDynamic hash={ data.user_operation_hash } noTooltip/>
    </mark>
  );

  if (isMobile) {
    return (
      <>
        <div className="flex items-center">
          { icon }
          { hash }
        </div>
        <Time timestamp={ data.timestamp } color="text.secondary" format="lll_s"/>
      </>
    );
  }

  return (
    <div className="flex gap-x-2">
      <div className="flex items-center min-w-0">
        { icon }
        { hash }
      </div>
      <Time timestamp={ data.timestamp } color="text.secondary" textAlign="end" flexShrink={ 0 } ml="auto" format="lll_s"/>
    </div>
  );
};

export default React.memo(SearchBarSuggestUserOp);
