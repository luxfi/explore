import React from 'react';

import type { MudWorldItem } from 'types/api/mudWorlds';

import { Skeleton } from '@luxfi/ui/skeleton';
import { TableCell, TableRow } from '@luxfi/ui/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

type Props = { item: MudWorldItem; isLoading?: boolean };

const MudWorldsTableItem = ({ item, isLoading }: Props) => {
  return (
    <TableRow>
      <TableCell verticalAlign="middle"><AddressEntity address={ item.address } isLoading={ isLoading } className="font-bold"/></TableCell>
      <TableCell isNumeric><NativeCoinValue amount={ item.coin_balance } noSymbol loading={ isLoading } lineHeight="24px"/></TableCell>
      <TableCell isNumeric><Skeleton loading={ isLoading } display="inline-block" className="leading-6">{ Number(item.transactions_count).toLocaleString() }</Skeleton></TableCell>
    </TableRow>
  );
};

export default MudWorldsTableItem;
