import React from 'react';

import type * as bens from '@luxfi/bens-types';
import type * as multichain from '@luxfi/multichain-aggregator-types';

import { route } from 'nextjs/routes';

import EnsEntity from 'ui/shared/entities/ens/EnsEntity';

import SearchResultListItem from '../SearchResultListItem';

interface Props {
  data: multichain.Domain;
}

const SearchResultItemDomain = ({ data }: Props) => {
  return (
    <SearchResultListItem
      href={ route({ pathname: '/address/[hash]', query: { hash: String(data.address) } }) }
    >
      <EnsEntity
        domain={ data.name }
        protocol={ data.protocol as bens.ProtocolInfo }
        noLink
        noCopy
        className="font-semibold lg:font-bold w-full"
      />
    </SearchResultListItem>
  );
};

export default React.memo(SearchResultItemDomain);
