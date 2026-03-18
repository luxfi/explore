import React from 'react';

import type { MudWorldItem } from 'types/api/mudWorlds';

import { currencyUnits } from 'lib/units';
import { Skeleton } from '@luxfi/ui/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

type Props = { item: MudWorldItem; isLoading?: boolean };

const MudWorldsListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobile className="gap-y-3">
      <AddressEntity address={ item.address } isLoading={ isLoading } className="font-bold mr-2" truncation="constant_long"/>
      <div className="flex gap-3 max-w-full items-start text-sm">
        <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink={ 0 }><span>{ `Balance ${ currencyUnits.ether }` }</span></Skeleton>
        <NativeCoinValue amount={ item.coin_balance } noSymbol loading={ isLoading } color="text.secondary"/>
      </div>
      <div className="flex gap-3">
        <Skeleton loading={ isLoading } className="text-sm font-medium">Txn count</Skeleton>
        <Skeleton loading={ isLoading } className="text-sm" color="text.secondary"><span>{ Number(item.transactions_count).toLocaleString() }</span></Skeleton>
      </div>
    </ListItemMobile>
  );
};

export default React.memo(MudWorldsListItem);
