import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryItem } from 'types/api/address';
import type { ClusterChainConfig } from 'types/multichain';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { ZERO } from 'toolkit/utils/consts';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { WEI } from 'ui/shared/value/utils';

type Props = AddressCoinBalanceHistoryItem & {
  page: number;
  isLoading: boolean;
  chainData?: ClusterChainConfig;
};

const AddressCoinBalanceTableItem = (props: Props) => {
  const deltaBn = BigNumber(props.delta).div(WEI);
  const isPositiveDelta = deltaBn.gte(ZERO);

  return (
    <TableRow>
      { props.chainData && (
        <TableCell>
          <ChainIcon data={ props.chainData } isLoading={ props.isLoading }/>
        </TableCell>
      ) }
      <TableCell>
        <BlockEntity
          isLoading={ props.isLoading }
          number={ props.block_number }
          noIcon
          className="font-bold"
        />
      </TableCell>
      <TableCell>
        { props.transaction_hash && (
          <TxEntity
            hash={ props.transaction_hash }
            isLoading={ props.isLoading }
            noIcon
            className="font-bold max-w-[150px]"
          />
        ) }
      </TableCell>
      <TableCell>
        <TimeWithTooltip
          timestamp={ props.block_timestamp }
          enableIncrement={ props.page === 1 }
          isLoading={ props.isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </TableCell>
      <TableCell isNumeric pr={ 1 }>
        <NativeCoinValue
          amount={ props.value }
          noSymbol
          loading={ props.isLoading }
          color="text.secondary"
        />
      </TableCell>
      <TableCell isNumeric display="flex" justifyContent="end">
        <Skeleton loading={ props.isLoading }>
          <div className="flex items-center gap-1 shrink-0">
            <span className="font-semibold text-sm">
              <SimpleValue
                value={ deltaBn }
                loading={ props.isLoading }
              />
            </span>
            <span className={ isPositiveDelta ? 'text-green-500' : 'text-red-500' }>
              { isPositiveDelta ? '\u25B2' : '\u25BC' }
            </span>
          </div>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(AddressCoinBalanceTableItem);
