import React from 'react';

import type { ZkSyncBatchesItem } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ZkSyncL2TxnBatchStatus from 'ui/shared/statusTag/ZkSyncL2TxnBatchStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ZkSyncBatchesItem; isLoading?: boolean };

const ZkSyncTxnBatchesTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'zkSync') {
    return null;
  }

  return (
    <TableRow>
      <TableCell verticalAlign="middle">
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          className="font-semibold"
          noIcon
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <ZkSyncL2TxnBatchStatus status={ item.status } isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        <TimeWithTooltip
          timestamp={ item.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell verticalAlign="middle">
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          loading={ isLoading }
          className="min-w-[40px] my-1"
        >
          { item.transactions_count }
        </Link>
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.commit_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.commit_transaction_hash }
            truncation="constant_long"
            noIcon
            noCopy
          />
        ) : <span>Pending</span> }
      </TableCell>
      <TableCell verticalAlign="middle">
        { item.prove_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.prove_transaction_hash }
            truncation="constant_long"
            noIcon
            noCopy
          />
        ) : <span>Pending</span> }
      </TableCell>
    </TableRow>
  );
};

export default ZkSyncTxnBatchesTableItem;
