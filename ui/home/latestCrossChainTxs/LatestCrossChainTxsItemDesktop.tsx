import React from 'react';

import type { InterchainMessage } from '@luxfi/interchain-indexer-types';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import { mdash } from 'toolkit/utils/htmlEntities';
import CrossChainBridgeLink from 'ui/shared/crossChain/CrossChainBridgeLink';
import CrossChainMessageEntity from 'ui/shared/entities/crossChainMessage/CrossChainMessageEntity';
import TxEntityInterchain from 'ui/shared/entities/tx/TxEntityInterchain';
import ChainLabel from 'ui/shared/externalChains/ChainLabel';
import CrossChainTxsStatusTag from 'ui/shared/statusTag/CrossChainTxsStatusTag';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

interface Props {
  data: InterchainMessage;
  isLoading?: boolean;
}

const LatestCrossChainTxsItemDesktop = ({ data, isLoading }: Props) => {

  return (
    <TableRow>
      <TableCell w="42px">
        <CrossChainTxsStatusTag status={ data.status } loading={ isLoading }/>
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-start">
          <CrossChainMessageEntity id={ data.message_id } isLoading={ isLoading } className="leading-6 font-bold"/>
          <TimeWithTooltip timestamp={ data.send_timestamp || data.receive_timestamp } isLoading={ isLoading } color="text.secondary" timeFormat="absolute"/>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-start">
          { data.source_transaction_hash ? (
            <TxEntityInterchain
              chain={ data.source_chain }
              hash={ data.source_transaction_hash }
              isLoading={ isLoading }
              noIcon
              noCopy
              truncation="constant"
              className="leading-6"
            />
          ) : (
            <span className="text-[var(--color-text-secondary)]">{ mdash }</span>
          ) }
          <ChainLabel
            data={ data.source_chain }
            isLoading={ isLoading }
            className="text-[var(--color-text-secondary)] text-xs"
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-start">
          { data.destination_transaction_hash ? (
            <TxEntityInterchain
              chain={ data.destination_chain }
              hash={ data.destination_transaction_hash }
              isLoading={ isLoading }
              noIcon
              noCopy
              truncation="constant"
              className="leading-6"
            />
          ) : (
            <span className="text-[var(--color-text-secondary)]">{ mdash }</span>
          ) }
          <ChainLabel
            data={ data.destination_chain }
            isLoading={ isLoading }
            className="text-[var(--color-text-secondary)] text-xs"
          />
        </div>
      </TableCell>
      <TableCell>
        <CrossChainBridgeLink data={ data.bridge } isLoading={ isLoading } className="leading-6"/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(LatestCrossChainTxsItemDesktop);
