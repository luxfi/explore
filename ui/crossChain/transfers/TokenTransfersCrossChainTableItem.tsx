import React from 'react';

import type { InterchainTransfer } from '@luxfi/interchain-indexer-types';

import config from 'configs/app';
import { TableCell, TableRow } from '@luxfi/ui/table';
import { mdash } from 'toolkit/utils/htmlEntities';
import AddressFromToIcon from 'ui/shared/address/AddressFromToIcon';
import CrossChainBridgeLink from 'ui/shared/crossChain/CrossChainBridgeLink';
import CrossChainFromToTag from 'ui/shared/crossChain/CrossChainFromToTag';
import AddressEntityInterchain from 'ui/shared/entities/address/AddressEntityInterchain';
import CrossChainMessageEntity from 'ui/shared/entities/crossChainMessage/CrossChainMessageEntity';
import TxEntityInterchain from 'ui/shared/entities/tx/TxEntityInterchain';
import ChainLabel from 'ui/shared/externalChains/ChainLabel';
import CrossChainTxsStatusTag from 'ui/shared/statusTag/CrossChainTxsStatusTag';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import TokenValueInterchain from 'ui/shared/value/TokenValueInterchain';

interface Props {
  data: InterchainTransfer;
  isLoading?: boolean;
  currentAddress?: string;
}

const TokenTransfersCrossChainTableItem = ({ data, isLoading, currentAddress }: Props) => {

  const dashElement = <span className="text-[var(--color-text-secondary)] leading-6">{ mdash }</span>;

  return (
    <TableRow>
      <TableCell w="42px">
        <CrossChainTxsStatusTag status={ data.status } loading={ isLoading }/>
      </TableCell>
      { currentAddress && (
        <TableCell>
          <CrossChainFromToTag
            type={ data.sender?.hash.toLowerCase() === currentAddress.toLowerCase() && config.chain.id === data.source_chain?.id ? 'out' : 'in' }
            isLoading={ isLoading }
          />
        </TableCell>
      ) }
      <TableCell maxW="150px">
        <div className="flex flex-col items-start">
          { data.source_token && (
            <TokenValueInterchain
              token={ data.source_token }
              amount={ data.source_amount }
              chain={ data.source_chain }
              loading={ isLoading }
              className="leading-6"
            />
          ) }
          {
            data.sender ? (
              <AddressEntityInterchain
                chain={ data.source_chain }
                address={ data.sender }
                isLoading={ isLoading }
                truncation="constant"
                noIcon
                currentAddress={ currentAddress }
                className="text-xs"
              />
            ) : dashElement
          }
        </div>
      </TableCell>
      <TableCell>
        <AddressFromToIcon type="unspecified" isLoading={ isLoading } className="mt-0.5"/>
      </TableCell>
      <TableCell maxW="150px">
        <div className="flex flex-col items-start">
          { data.destination_token && (
            <TokenValueInterchain
              token={ data.destination_token }
              amount={ data.destination_amount }
              chain={ data.destination_chain }
              loading={ isLoading }
              className="leading-6"
            />
          ) }
          {
            data.recipient ? (
              <AddressEntityInterchain
                chain={ data.destination_chain }
                address={ data.recipient }
                isLoading={ isLoading }
                truncation="constant"
                noIcon
                currentAddress={ currentAddress }
                className="text-xs"
              />
            ) : dashElement
          }
        </div>
      </TableCell>
      <TableCell maxW="150px">
        <div className="flex flex-col items-start">
          { data.source_transaction_hash ? (
            <TxEntityInterchain
              chain={ data.source_chain }
              hash={ data.source_transaction_hash }
              isLoading={ isLoading }
              noIcon
              truncation="constant"
              className="leading-6"
            />
          ) : dashElement }
          <ChainLabel
            data={ data.source_chain }
            isLoading={ isLoading }
            className="text-[var(--color-text-secondary)] text-xs gap-1"
          />
        </div>
      </TableCell>
      <TableCell maxW="150px">
        <div className="flex flex-col items-start">
          { data.destination_transaction_hash ? (
            <TxEntityInterchain
              chain={ data.destination_chain }
              hash={ data.destination_transaction_hash }
              isLoading={ isLoading }
              noIcon
              truncation="constant"
              className="leading-6"
            />
          ) : dashElement }
          <ChainLabel
            data={ data.destination_chain }
            isLoading={ isLoading }
            className="text-[var(--color-text-secondary)] text-xs gap-1"
          />
        </div>
      </TableCell>
      <TableCell>
        <CrossChainBridgeLink data={ data.bridge } isLoading={ isLoading } className="leading-6"/>
      </TableCell>
      <TableCell>
        <CrossChainMessageEntity id={ data.message_id } isLoading={ isLoading } className="leading-6"/>
      </TableCell>
      <TableCell>
        <TimeWithTooltip
          timestamp={ data.send_timestamp || data.receive_timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          className="leading-6 whitespace-nowrap"
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TokenTransfersCrossChainTableItem);
