import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import EntityTag from 'ui/shared/EntityTags/EntityTag';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TxFee from 'ui/shared/tx/TxFee';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
  isLoading?: boolean;
};

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  const protocolTag = tx.to?.metadata?.tags?.find(tag => tag.tagType === 'protocol');

  return (
    <div
      width="100%"
      borderBottom="1px solid"
      borderColor="border.divider"
      py={ 4 }
      display={{ base: 'block', lg: 'none' }}
    >
      <div justifyContent="space-between">
        <div>
          <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
          { tx.status !== 'ok' && <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/> }
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
          { protocolTag && <EntityTag data={ protocolTag } isLoading={ isLoading } minW="0" noColors/> }
        </div>
        <TxAdditionalInfo tx={ tx } isMobile isLoading={ isLoading }/>
      </div>
      <div
        mt={ 2 }
        alignItems="center"
        width="100%"
        justifyContent="space-between"
        mb={ 6 }
      >
        <TxEntity
          isLoading={ isLoading }
          hash={ tx.hash }
          className="font-bold"
          truncation="constant_long"
        />
        <TimeWithTooltip
          timestamp={ tx.timestamp }
          enableIncrement
          timeFormat="relative"
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight="400"
          ml={ 3 }
        />
      </div>
      <AddressFromTo
        from={ tx.from }
        to={ dataTo }
        isLoading={ isLoading }
        className="font-medium"
      />
      { !(config.UI.views.tx.hiddenFields?.value && config.UI.views.tx.hiddenFields?.tx_fee) ? (
        <div rowGap={ 2 } mt={ 3 } alignItems="flex-start">
          { !config.UI.views.tx.hiddenFields?.value && (
            <Skeleton loading={ isLoading } w="fit-content">
              <span as="span">Value </span>
              <NativeCoinValue
                amount={ tx.value }
                accuracy={ 5 }
                loading={ isLoading }
                color="text.secondary"
              />
            </Skeleton>
          ) }
          { !config.UI.views.tx.hiddenFields?.tx_fee && (
            <Skeleton loading={ isLoading } w="fit-content" display="flex" className="whitespace-pre">
              <span as="span">Fee </span>
              <TxFee tx={ tx } accuracy={ 5 } color="text.secondary" noUsd/>
            </Skeleton>
          ) }
        </div>
      ) : null }
    </div>
  );
};

export default React.memo(LatestTxsItem);
