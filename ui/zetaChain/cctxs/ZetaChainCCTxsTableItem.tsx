import React from 'react';

import type { CctxListItem } from '@luxfi/zetachain-cctx-types';

import { TableCell, TableRow } from '@luxfi/ui/table';
import { SECOND } from 'toolkit/utils/consts';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TxEntityZetaChainCC from 'ui/shared/entities/tx/TxEntityZetaChainCC';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import ZetaChainCCTXReducedStatus from 'ui/shared/zetaChain/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';

type Props = {
  tx: CctxListItem;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  animation?: string;
};

const ZetaChainCCTxsTableItem = ({ tx, enableTimeIncrement, isLoading, animation }: Props) => {
  return (
    <TableRow key={ tx.index }>
      <TableCell>
        <div className="flex flex-row">
          <TxEntityZetaChainCC
            hash={ tx.index }
            isLoading={ isLoading }
           
            noIcon
            truncation="constant"
          />
          <TimeWithTooltip
            timestamp={ Number(tx.last_update_timestamp) * SECOND }
            enableIncrement={ enableTimeIncrement }
            isLoading={ isLoading }
          />
        </div>
      </TableCell>
      <TableCell>
        <ZetaChainCCTXReducedStatus status={ tx.status_reduced } type="full" isLoading={ isLoading }/>
      </TableCell>
      <TableCell style={{ gridColumn: "span 2" }}>
        <AddressFromTo
          from={{ hash: tx.sender_address, chainId: tx.source_chain_id.toString(), chainType: 'zeta' }}
          to={{ hash: tx.receiver_address, chainId: tx.target_chain_id.toString(), chainType: 'zeta' }}
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell isNumeric>
        <ZetaChainCCTXValue
          coinType={ tx.coin_type }
          tokenSymbol={ tx.token_symbol }
          amount={ tx.amount }
          decimals={ tx.decimals }
          isLoading={ isLoading }
          className="justify-end"
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(ZetaChainCCTxsTableItem);
