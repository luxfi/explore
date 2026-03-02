import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import { ZERO } from 'toolkit/utils/consts';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: AddressesItem;
  index: number;
  totalSupply: BigNumber;
  isLoading?: boolean;
};

const AddressesListItem = ({
  item,
  index,
  totalSupply,
  isLoading,
}: Props) => {

  const addressBalance = BigNumber(item.coin_balance || 0).div(BigNumber(10 ** config.chain.currency.decimals));
  // On pruned nodes, coin_balance may be null even for addresses with transactions.
  // Show "Pending" instead of a misleading "0".
  const isBalancePending = item.coin_balance === null && Number(item.transactions_count) > 0;

  return (
    <ListItemMobile className="!gap-y-3">
      <div className="flex items-center justify-between w-full">
        <AddressEntity
          address={ item }
          isLoading={ isLoading }
          className="font-bold mr-2"
         
          truncation="constant"
        />
        <Skeleton loading={ isLoading } fontSize="sm" ml="auto" minW={ 6 } color="text.secondary">
          <span>{ index }</span>
        </Skeleton>
      </div>
      { item.public_tags !== null && item.public_tags.length > 0 && item.public_tags.map(tag => (
        <Tag key={ tag.label } loading={ isLoading } truncated>{ tag.display_name }</Tag>
      )) }
      <div className="flex flex-row gap-3 max-w-full items-[flex-start]">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 } flexShrink={ 0 }>{ `Balance ${ currencyUnits.ether }` }</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary" minW="0" whiteSpace="pre-wrap">
          <span>{ isBalancePending ? 'Pending' : addressBalance.dp(8).toFormat() }</span>
        </Skeleton>
      </div>
      { !totalSupply.eq(ZERO) && !isBalancePending && (
        <div className="flex flex-row gap-3">
          <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Percentage</Skeleton>
          <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary">
            <span>{ addressBalance.div(BigNumber(totalSupply)).multipliedBy(100).dp(8).toFormat() + '%' }</span>
          </Skeleton>
        </div>
      ) }
      <div className="flex flex-row gap-3">
        <Skeleton loading={ isLoading } fontSize="sm" fontWeight={ 500 }>Txn count</Skeleton>
        <Skeleton loading={ isLoading } fontSize="sm" color="text.secondary">
          <span>{ Number(item.transactions_count).toLocaleString() }</span>
        </Skeleton>
      </div>
    </ListItemMobile>
  );
};

export default React.memo(AddressesListItem);
