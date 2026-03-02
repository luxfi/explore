import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultBlob } from 'types/api/search';

import * as BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

const SearchBarSuggestBlob = ({ data }: ItemsProps<SearchResultBlob>) => {
  return (
    <div className="flex items-center min-w-0">
      <BlobEntity.Icon/>
      <mark className="overflow-hidden whitespace-nowrap font-bold">
        <HashStringShortenDynamic hash={ data.blob_hash } noTooltip/>
      </mark>
    </div>
  );
};

export default React.memo(SearchBarSuggestBlob);
