import BigNumber from 'bignumber.js';
import React from 'react';

import type { HotContract } from 'types/api/contracts';

import { Skeleton } from '@luxfi/ui/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { Reputation } from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

interface Props {
  data: HotContract;
  isLoading?: boolean;
  exchangeRate: string | null;
}

const HotContractsListItem = ({ data, isLoading, exchangeRate }: Props) => {
  const protocolTags = data?.contract_address?.metadata?.tags?.filter(tag => tag.tagType === 'protocol');

  return (
    <ListItemMobile className="!gap-y-3 !py-4 text-sm">
      <div className="flex justify-between w-full">
        <AddressEntity
          address={ data.contract_address }
          isLoading={ isLoading }
        />
        <Reputation value={ data.contract_address.reputation ?? null }/>
      </div>
      { protocolTags && protocolTags.length > 0 && (
        <EntityTags
          isLoading={ isLoading }
          tags={ protocolTags }
          noColors
        />
      ) }
      <div>
        <Skeleton loading={ isLoading } fontWeight={ 500 } w="100px">Txn count</Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ Number(data.transactions_count).toLocaleString() }</span>
        </Skeleton>
      </div>
      <div>
        <Skeleton loading={ isLoading } fontWeight={ 500 } w="100px">Gas used</Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ BigNumber(data.total_gas_used || 0).toFormat() }</span>
        </Skeleton>
      </div>
      <div className="flex items-start">
        <Skeleton loading={ isLoading } fontWeight={ 500 } w="100px">Balance</Skeleton>
        <NativeCoinValue
          amount={ data.balance }
          loading={ isLoading }
          exchangeRate={ exchangeRate }
          flexWrap="wrap"
        />
      </div>
    </ListItemMobile>
  );
};

export default React.memo(HotContractsListItem);
