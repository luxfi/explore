import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';
import type { ClusterChainConfig } from 'types/multichain';

import { currencyUnits } from 'lib/units';
import { Badge } from '@luxfi/ui/badge';
import { Skeleton } from '@luxfi/ui/skeleton';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & { currentAddress?: string; isLoading?: boolean; showBlockInfo?: boolean; chainData?: ClusterChainConfig };

const InternalTxsListItem = ({
  type,
  from,
  to,
  value,
  success,
  error,
  created_contract: createdContract,
  transaction_hash: txnHash,
  block_number: blockNumber,
  timestamp,
  currentAddress,
  isLoading,
  showBlockInfo = true,
  chainData,
}: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <ListItemMobile className="!gap-y-3">
      <div className="flex gap-x-2">
        { typeTitle && <Badge colorPalette="cyan" loading={ isLoading }>{ typeTitle }</Badge> }
        { !success && <TxStatus status="error" errorText={ error } isLoading={ isLoading }/> }
      </div>
      <div className="flex justify-between w-full">
        <TxEntity
          hash={ txnHash }
          isLoading={ isLoading }
          className="font-bold"
          truncation="constant_long"
          chain={ chainData }
        />
        <TimeWithTooltip
          timestamp={ timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight="400"
          fontSize="sm"
        />
      </div>
      { showBlockInfo && (
        <div className="flex gap-1">
          <Skeleton loading={ isLoading } className="text-sm font-medium">Block</Skeleton>
          <BlockEntity
            isLoading={ isLoading }
            number={ blockNumber }
            noIcon
            className="text-sm"
          />
        </div>
      ) }
      <AddressFromTo
        from={ from }
        to={ toData }
        current={ currentAddress }
        isLoading={ isLoading }
        className="w-full"
      />
      <div className="flex gap-3">
        <Skeleton loading={ isLoading } className="text-sm font-medium">Value { currencyUnits.ether }</Skeleton>
        <NativeCoinValue
          amount={ value }
          noSymbol
          accuracy={ 0 }
          loading={ isLoading }
          minW={ 6 }
          fontSize="sm"
          color="text.secondary"
        />
      </div>
    </ListItemMobile>
  );
};

export default InternalTxsListItem;
