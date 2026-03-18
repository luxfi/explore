import React from 'react';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import ZkEvmL2TxnBatchStatus from 'ui/shared/statusTag/ZkEvmL2TxnBatchStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ZkEvmL2TxnBatchesItem; isLoading?: boolean };

const ZkEvmTxnBatchesListItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'zkEvm') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Batch #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          className="font-semibold"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ZkEvmL2TxnBatchStatus status={ item.status } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
          className="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Txn count</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          loading={ isLoading }
          className="font-semibold min-w-[40px]"
        >
          { item.transactions_count }
        </Link>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Verify tx hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.verify_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.verify_transaction_hash }
            truncation="constant_long"
            noCopy
          />
        ) : <span>Pending</span> }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Sequence hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.sequence_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.sequence_transaction_hash }
            truncation="constant_long"
            noCopy
          />
        ) : <span>Pending</span> }
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ZkEvmTxnBatchesListItem;
