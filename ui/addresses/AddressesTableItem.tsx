import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressesItem } from 'types/api/addresses';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tag } from 'toolkit/chakra/tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import SimpleValue from 'ui/shared/value/SimpleValue';

type Props = {
  item: AddressesItem;
  index: number;
  totalSupply: BigNumber;
  hasPercentage: boolean;
  isLoading?: boolean;
};

const AddressesTableItem = ({
  item,
  index,
  totalSupply,
  hasPercentage,
  isLoading,
}: Props) => {

  const addressBalance = BigNumber(item.coin_balance || 0).div(BigNumber(10 ** config.chain.currency.decimals));
  // On pruned nodes, coin_balance may be null even for addresses with transactions.
  // Show "Pending" instead of a misleading "0".
  const isBalancePending = item.coin_balance === null && Number(item.transactions_count) > 0;

  return (
    <TableRow>
      <TableCell>
        <Skeleton loading={ isLoading } display="inline-block" minW={ 6 } lineHeight="24px">
          { index }
        </Skeleton>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-x-2">
          <AddressEntity
            address={ item }
            isLoading={ isLoading }
            className="font-bold my-[2px]"
           
          />
          { item.public_tags && item.public_tags.length ? item.public_tags.map(tag => (
            <Tag key={ tag.label } loading={ isLoading } truncated>{ tag.display_name }</Tag>
          )) : null }
        </div>
      </TableCell>
      <TableCell isNumeric>
        { isBalancePending ? (
          <Skeleton loading={ isLoading } display="inline-block" lineHeight="24px">
            <span className="text-[var(--color-text-secondary)] text-sm">Pending</span>
          </Skeleton>
        ) : (
          <SimpleValue
            value={ addressBalance }
            loading={ isLoading }
            lineHeight="24px"
          />
        ) }
      </TableCell>
      { hasPercentage && (
        <TableCell isNumeric>
          { isBalancePending ? (
            <Skeleton loading={ isLoading } display="inline-block" lineHeight="24px">
              <span className="text-[var(--color-text-secondary)] text-sm">Pending</span>
            </Skeleton>
          ) : (
            <SimpleValue
              value={ addressBalance.div(totalSupply).multipliedBy(100) }
              loading={ isLoading }
              postfix="%"
              lineHeight="24px"
            />
          ) }
        </TableCell>
      ) }
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="inline-block" lineHeight="24px">
          { Number(item.transactions_count).toLocaleString() }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddressesTableItem);
