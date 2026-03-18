import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import { cn } from 'lib/utils/cn';
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
  const columnNum = config.UI.views.tx.hiddenFields?.value && config.UI.views.tx.hiddenFields?.tx_fee ? 2 : 3;

  const protocolTag = tx.to?.metadata?.tags?.find(tag => tag.tagType === 'protocol');

  const tagsCount = [
    1, // tx type
    1, // tx status
    ...(tx.from?.watchlist_names || []),
    ...(tx.to?.watchlist_names || []),
    protocolTag,
  ].filter(Boolean).length;

  return (
    <div
      className={ cn(
        'hidden lg:grid gap-3 w-full border-b border-[var(--color-border-divider)] p-4',
        'transition-colors hover:bg-[var(--color-blackAlpha-50)] dark:hover:bg-[var(--color-whiteAlpha-50)]',
        columnNum === 2 ? 'min-w-[700px]' : 'min-w-[750px]',
      ) }
      style={{
        gridTemplateColumns: columnNum === 2 ?
          '3fr minmax(auto, 270px)' :
          '3fr minmax(auto, 300px) 170px',
      }}
    >
      <div className="overflow-hidden w-full">
        <TxAdditionalInfo tx={ tx } isLoading={ isLoading } className="my-[3px]"/>
        <div className="ml-3 w-[calc(100%-40px)]">
          <div className={ `flex ${ tagsCount <= 3 ? 'flex-nowrap' : 'flex-wrap' } my-[3px]` }>
            <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
            { tx.status !== 'ok' && <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/> }
            <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
            { protocolTag && <EntityTag data={ protocolTag } isLoading={ isLoading } minW="0" noColors/> }
          </div>
          <div className="flex items-center mt-[7px] mb-[3px]">
            <TxEntity
              isLoading={ isLoading }
              hash={ tx.hash }
              className="font-bold"
            />
            <TimeWithTooltip
              timestamp={ tx.timestamp }
              enableIncrement
              timeFormat="relative"
              isLoading={ isLoading }
              color="text.secondary"
              flexShrink={ 0 }
              ml={ 2 }
            />
          </div>
        </div>
      </div>
      <AddressFromTo
        from={ tx.from }
        to={ dataTo }
        isLoading={ isLoading }
        mode="compact"
      />
      { !(config.UI.views.tx.hiddenFields?.value && config.UI.views.tx.hiddenFields?.tx_fee) ? (
        <div className="flex flex-col gap-y-3">
          { !config.UI.views.tx.hiddenFields?.value && (
            <Skeleton loading={ isLoading }>
              <span className="whitespace-pre">Value </span>
              <NativeCoinValue
                amount={ tx.value }
                accuracy={ 5 }
                loading={ isLoading }
                color="text.secondary"
              />
            </Skeleton>
          ) }
          { !config.UI.views.tx.hiddenFields?.tx_fee && (
            <Skeleton loading={ isLoading } display="flex" className="whitespace-pre">
              <span>Fee </span>
              <TxFee tx={ tx } accuracy={ 5 } color="text.secondary" noUsd/>
            </Skeleton>
          ) }
        </div>
      ) : null }
    </div>
  );
};

export default React.memo(LatestTxsItem);
