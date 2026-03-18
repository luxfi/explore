import React from 'react';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = {
  number: number;
  timestamp: string | null;
  txCount: number;
  status?: React.ReactNode;
  isLoading: boolean;
  animation?: string;
};

const LatestBatchItem = ({ number, timestamp, txCount, status, isLoading, animation }: Props) => {
  return (
    <div
      className="rounded-md border border-solid border-[var(--color-border-divider)] p-3"
      style={ animation ? { animation } : undefined }
    >
      <div className="flex items-center overflow-hidden w-full mb-3">
        <BatchEntityL2
          isLoading={ isLoading }
          number={ number }
          tailLength={ 2 }
          className="text-base font-medium mr-auto"
        />
        <TimeWithTooltip
          timestamp={ timestamp }
          enableIncrement={ !isLoading }
          timeFormat="relative"
          isLoading={ isLoading }
          className="text-[var(--color-text-secondary)] inline-block text-sm shrink-0 ml-2"
        />
      </div>
      <div className="flex items-center justify-between w-full flex-wrap text-sm">
        <div className="flex items-center">
          <Skeleton loading={ isLoading } mr={ 2 }>Txn</Skeleton>
          <Link
            href={ route({ pathname: '/batches/[number]', query: { number: number.toString(), tab: 'txs' } }) }
            loading={ isLoading }
          >
            { txCount }
          </Link>
        </div>
        { status }
      </div>
    </div>
  );
};

export default LatestBatchItem;
