import React from 'react';

import type { NovesDescribeTxsResponse } from 'types/api/noves';
import type { Transaction } from 'types/api/transaction';
import type { ClusterChainConfig } from 'types/multichain';

import config from 'configs/app';
import { Skeleton } from '@luxfi/ui/skeleton';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import EntityTag from 'ui/shared/EntityTags/EntityTag';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TxFee from 'ui/shared/tx/TxFee';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

import TxTranslationType from './TxTranslationType';

type Props = {
  tx: Transaction;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  animation?: string;
  chainData?: ClusterChainConfig;
  translationIsLoading?: boolean;
  translationData?: NovesDescribeTxsResponse;
};

const TxsListItem = ({
  tx,
  isLoading,
  showBlockInfo,
  currentAddress,
  enableTimeIncrement,
  animation,
  chainData,
  translationIsLoading,
  translationData,
}: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  const protocolTag = tx.to?.hash !== currentAddress && tx.to?.metadata?.tags?.find(tag => tag.tagType === 'protocol');

  return (
    <ListItemMobile className="block" key={ tx.hash }>
      <div className="flex">
        <div className="flex flex-row">
          { translationIsLoading || translationData ? (
            <TxTranslationType
              txTypes={ tx.transaction_types }
              isLoading={ isLoading || translationIsLoading }
              type={ translationData?.type }
            />
          ) :
            <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
          }
          { tx.status !== 'ok' && <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/> }
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
          { protocolTag && <EntityTag data={ protocolTag } isLoading={ isLoading } noColors/> }
        </div>
        <TxAdditionalInfo tx={ tx } isMobile isLoading={ isLoading }/>
      </div>
      <div className="flex">
        <TxEntity
          isLoading={ isLoading }
          hash={ tx.hash }
          truncation="constant_long"
          className="font-bold"
          icon={ !tx.is_pending_update && tx.transaction_types.includes('blob_transaction') ? { name: 'blob' } : undefined }
          chain={ chainData }
          isPendingUpdate={ tx.is_pending_update }
        />
        <TimeWithTooltip
          timestamp={ tx.timestamp }
          enableIncrement={ enableTimeIncrement }
          isLoading={ isLoading }
         
        />
      </div>
      { tx.method && (
        <div className="flex">
          <Skeleton loading={ isLoading } className="inline-block whitespace-pre">Method </Skeleton>
          <Skeleton
            loading={ isLoading }
            className="text-[var(--color-text-secondary)] overflow-hidden whitespace-nowrap text-ellipsis"
          >
            <span>{ tx.method }</span>
          </Skeleton>
        </div>
      ) }
      { showBlockInfo && tx.block_number !== null && (
        <div className="flex">
          <Skeleton loading={ isLoading } className="inline-block whitespace-pre">Block </Skeleton>
          <BlockEntity
            isLoading={ isLoading }
            number={ tx.block_number }
            noIcon
          />
        </div>
      ) }
      <AddressFromTo
        from={ tx.from }
        to={ dataTo }
        current={ currentAddress }
        isLoading={ isLoading }
        className="font-medium"
      />
      { !config.UI.views.tx.hiddenFields?.value && (
        <div className="flex">
          <Skeleton loading={ isLoading } className="inline-block whitespace-pre">Value </Skeleton>
          <NativeCoinValue
            amount={ tx.value }
            exchangeRate={ tx.exchange_rate }
            historicalExchangeRate={ tx.historic_exchange_rate }
            loading={ isLoading }
          />
        </div>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <div className="flex">
          { (tx.stability_fee !== undefined || tx.fee.value !== null) && (
            <>
              <Skeleton loading={ isLoading } className="inline-block whitespace-pre">Fee </Skeleton>
              <TxFee tx={ tx } loading={ isLoading }/>
            </>
          ) }
        </div>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TxsListItem);
