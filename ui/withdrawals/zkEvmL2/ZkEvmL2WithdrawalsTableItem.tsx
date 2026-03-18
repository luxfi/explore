import BigNumber from 'bignumber.js';
import React from 'react';

import type { ZkEvmL2WithdrawalsItem } from 'types/api/zkEvmL2';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import SimpleValue from 'ui/shared/value/SimpleValue';

const rollupFeature = config.features.rollup;

type Props = { item: ZkEvmL2WithdrawalsItem; isLoading?: boolean };

const ZkEvmL2WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'zkEvm') {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <BlockEntity
          number={ item.block_number }
          isLoading={ isLoading }
          className="font-semibold"
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading }>
          <span>{ item.index }</span>
        </Skeleton>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_transaction_hash }
          truncation="constant_long"
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.l1_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.l1_transaction_hash }
            truncation="constant_long"
            noIcon
            noCopy
          />
        ) : (
          <span>
            Pending Claim
          </span>
        ) }
      </TableCell>
      <TableCell verticalAlign="middle" isNumeric>
        <SimpleValue
          value={ BigNumber(item.value) }
          loading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } className="inline-block">
          <span>{ item.symbol }</span>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default ZkEvmL2WithdrawalsTableItem;
