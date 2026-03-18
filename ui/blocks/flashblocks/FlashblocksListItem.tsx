import React from 'react';

import type { FlashblockItem } from 'types/client/flashblocks';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import FlashblockEntity from 'ui/shared/entities/flashblock/FlashblockEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import Time from 'ui/shared/time/Time';

interface Props {
  data: FlashblockItem;
}

const FlashblocksListItem = ({ data }: Props) => {
  return (
    <ListItemMobile>
      <div className="flex justify-between w-full">
        { data.block_number ? (
          <FlashblockEntity
            number={ data.block_number }
            index={ data.index }
            className="font-semibold"
          />
        ) : <span className="text-[var(--color-text-secondary)]">N/A</span> }
      </div>
      { data.timestamp && (
        <div className="flex gap-x-2">
          <span className="font-medium">Timestamp</span>
          <Time className="text-[var(--color-text-secondary)]" timestamp={ data.timestamp } format="DD MMM, HH:mm:ss.SSS"/>
        </div>
      ) }
      <div className="flex gap-x-2">
        <span className="font-medium">Txn</span>
        { data.transactions_count > 0 ? (
          <Link href={ route({
            pathname: '/block/[height_or_hash]',
            query: { height_or_hash: String(data.block_number), tab: 'txs' },
          }) }>
            { data.transactions_count }
          </Link>
        ) :
          <span className="text-[var(--color-text-secondary)]">{ data.transactions_count }</span>
        }
      </div>
      <div className="flex gap-x-2">
        <span className="font-medium">Gas used</span>
        <span className="text-[var(--color-text-secondary)]">{ data.gas_used.toLocaleString() }</span>
      </div>
    </ListItemMobile>
  );
};

export default FlashblocksListItem;
