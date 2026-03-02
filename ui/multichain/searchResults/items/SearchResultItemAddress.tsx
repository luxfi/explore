import React from 'react';

import type * as multichain from '@luxfi/multichain-aggregator-types';

import { route } from 'nextjs/routes';

import * as contract from 'lib/multichain/contract';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import SearchResultListItem from '../SearchResultListItem';

interface Props {
  data: multichain.GetAddressResponse;
  isMobile?: boolean;
}

const SearchResultItemAddress = ({ data, isMobile }: Props) => {

  const contractName = contract.getName(data);

  return (
    <SearchResultListItem
      href={ route({ pathname: '/address/[hash]', query: { hash: data.hash } }) }
    >
      <div className="w-full lg:w-[200px]">
        <AddressEntity
          address={{
            hash: data.hash,
            is_contract: contract.isContract(data),
            is_verified: contract.isVerified(data),
          }}
          truncation={ !isMobile ? 'constant' : 'dynamic' }
          noLink
          noCopy
          className="font-semibold lg:font-bold"
        />
      </div>
      { contractName && (
        <div className="text-[var(--color-text-secondary)] group-hover:text-inherit font-normal lg:font-medium">
          { contractName }
        </div>
      ) }
    </SearchResultListItem>
  );
};

export default React.memo(SearchResultItemAddress);
