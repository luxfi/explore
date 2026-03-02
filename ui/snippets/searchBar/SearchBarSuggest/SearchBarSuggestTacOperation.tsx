import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultTacOperation } from 'types/api/search';

import * as OperationEntity from 'ui/shared/entities/operation/OperationEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import TacOperationStatus from 'ui/shared/statusTag/TacOperationStatus';
import Time from 'ui/shared/time/Time';

const SearchBarSuggestTacOperation = ({ data, isMobile }: ItemsProps<SearchResultTacOperation>) => {
  const icon = <OperationEntity.Icon type={ data.tac_operation.type }/>;
  const hash = (
    <mark className="overflow-hidden whitespace-nowrap font-bold mr-2">
      <HashStringShortenDynamic hash={ data.tac_operation.operation_id } noTooltip/>
    </mark>
  );
  const status = <TacOperationStatus status={ data.tac_operation.type }/>;

  if (isMobile) {
    return (
      <>
        <div className="flex items-center">
          { icon }
          { hash }
          { status }
        </div>
        <Time timestamp={ data.tac_operation.timestamp } color="text.secondary" format="lll_s"/>
      </>
    );
  }

  return (
    <div className="flex gap-x-2">
      <div className="flex items-center min-w-0">
        { icon }
        { hash }
        { status }
      </div>
      <Time timestamp={ data.tac_operation.timestamp } color="text.secondary" textAlign="end" flexShrink={ 0 } ml="auto" format="lll_s"/>
    </div>
  );
};

export default React.memo(SearchBarSuggestTacOperation);
