import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

type Props = {
  item: AddressesItem;
  isLoading?: boolean;
};

const AddressesLabelSearchListItem = ({
  item,
  isLoading,
}: Props) => {

  return (
    <ListItemMobile className="!gap-y-3">
      <AddressEntity
        address={ item }
        isLoading={ isLoading }
        className="font-bold w-full"
       
      />
      <div className="flex flex-row gap-3 max-w-full items-[flex-start]">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 } flexShrink={ 0 }>{ `Balance ${ currencyUnits.ether }` }</Skeleton>
        <NativeCoinValue
          amount={ item.coin_balance }
          noSymbol
          loading={ isLoading }
          fontSize="sm"
          color="text.secondary"
        />
      </div>
      <div className="flex flex-row gap-3">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Txn count</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary">
          <span>{ Number(item.transactions_count).toLocaleString() }</span>
        </Skeleton>
      </div>
    </ListItemMobile>
  );
};

export default React.memo(AddressesLabelSearchListItem);
