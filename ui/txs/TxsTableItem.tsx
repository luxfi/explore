import React from 'react';

import type { NovesDescribeTxsResponse } from 'types/api/noves';
import type { Transaction } from 'types/api/transaction';
import type { ClusterChainConfig } from 'types/multichain';

import config from 'configs/app';
import { Badge } from '@luxfi/ui/badge';
import { TableCell, TableRow } from '@luxfi/ui/table';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import BlockPendingUpdateHint from 'ui/shared/block/BlockPendingUpdateHint';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import EntityTag from 'ui/shared/EntityTags/EntityTag';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TxFee from 'ui/shared/tx/TxFee';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import TxTranslationType from './TxTranslationType';
import TxType from './TxType';

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
  isMobile?: boolean;
};

const TxsTableItem = ({
  tx,
  showBlockInfo,
  currentAddress,
  enableTimeIncrement,
  isLoading,
  chainData,
  translationIsLoading,
  translationData,
  isMobile,
}: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;

  const protocolTag = tx.to?.hash !== currentAddress && tx.to?.metadata?.tags?.find(tag => tag.tagType === 'protocol');

  return (
    <TableRow key={ tx.hash }>
      <TableCell>
        <TxAdditionalInfo tx={ tx } isMobile={ isMobile } isLoading={ isLoading }/>
      </TableCell>
      { chainData && (
        <TableCell>
          <ChainIcon data={ chainData } isLoading={ isLoading } my="2px"/>
        </TableCell>
      ) }
      <TableCell>
        <div className="flex flex-col">
          <TxEntity
            hash={ tx.hash }
            isLoading={ isLoading }
            className="font-mono"
            noIcon
            truncation="constant"
          />
          <TimeWithTooltip
            timestamp={ tx.timestamp }
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
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
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          { tx.method && (
            <Badge colorPalette={ tx.method === 'Multicall' ? 'teal' : 'gray' } loading={ isLoading } truncated>
              <span>{ tx.method }</span>
            </Badge>
          ) }
          { protocolTag && <EntityTag data={ protocolTag } isLoading={ isLoading } noColors/> }
        </div>
      </TableCell>
      { showBlockInfo && (
        <TableCell>
          <div className="flex">
            { tx.block_number && (
              <BlockEntity
                isLoading={ isLoading }
                number={ tx.block_number }
                noIcon
                className="font-medium"
              />
            ) }
            { tx.is_pending_update && <BlockPendingUpdateHint view="tx"/> }
          </div>
        </TableCell>
      ) }
      <TableCell>
        <AddressFromTo
          from={ tx.from }
          to={ dataTo }
          current={ currentAddress }
          isLoading={ isLoading }
          className="mt-[2px]"
          mode="compact"
        />
      </TableCell>
      { !config.UI.views.tx.hiddenFields?.value && (
        <TableCell isNumeric>
          <NativeCoinValue
            amount={ tx.value }
            noSymbol
            loading={ isLoading }
            exchangeRate={ tx.exchange_rate }
            historicalExchangeRate={ tx.historic_exchange_rate }
            layout="vertical"
          />
        </TableCell>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <TableCell isNumeric>
          <TxFee
            tx={ tx }
            accuracy={ 8 }
            loading={ isLoading }
            noSymbol={ !(tx.celo || tx.stability_fee) }
            layout="vertical"
          />
        </TableCell>
      ) }
    </TableRow>
  );
};

export default React.memo(TxsTableItem);
