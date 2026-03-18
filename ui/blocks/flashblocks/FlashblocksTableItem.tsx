import React from 'react';

import type { FlashblockItem } from 'types/client/flashblocks';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import FlashblockEntity from 'ui/shared/entities/flashblock/FlashblockEntity';
import Time from 'ui/shared/time/Time';

interface Props {
  data: FlashblockItem;
}

const FlashblocksTableItem = ({ data }: Props) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          { data.block_number ? (
            <FlashblockEntity
              number={ data.block_number }
              index={ data.index }
              noIcon
            />
          ) : (
            <span className="text-[var(--color-text-secondary)]">N/A</span>
          ) }
          { data.timestamp && <Time className="text-[var(--color-text-secondary)]" timestamp={ data.timestamp } format="DD MMM, HH:mm:ss.SSS"/> }
        </div>
      </TableCell>
      <TableCell isNumeric>
        { data.transactions_count > 0 ? (
          <Link href={ route({
            pathname: '/block/[height_or_hash]',
            query: { height_or_hash: String(data.block_number), tab: 'txs' },
          }) }>
            { data.transactions_count }
          </Link>
        ) : (
          <span className="text-[var(--color-text-secondary)]">{ data.transactions_count }</span>
        ) }
      </TableCell>
      <TableCell isNumeric>
        { data.gas_used.toLocaleString() }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(FlashblocksTableItem);
