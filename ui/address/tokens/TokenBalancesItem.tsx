import React from 'react';

import { Skeleton } from '@luxfi/ui/skeleton';

type Props = {
  name: string;
  value: string;
  icon: React.ReactNode;
  valueSecondary?: string;
  isLoading: boolean;
  contentAfter?: React.ReactNode;
};

const TokenBalancesItem = ({ name, icon, value, valueSecondary, isLoading, contentAfter }: Props) => {

  return (
    <div className="px-[12px] py-[10px] rounded">
      <span className="text-[var(--color-text-secondary)] text-xs font-medium mb-1">{ name }</span>
      <div className="flex items-center">
        { icon }
        <Skeleton loading={ isLoading } fontWeight="500" whiteSpace="pre-wrap" wordBreak="break-word" display="flex" ml={ 2 }>
          { value }
          { Boolean(valueSecondary) && <span className="text-[var(--color-text-secondary)]"> ({ valueSecondary })</span> }
        </Skeleton>
        { contentAfter }
      </div>
    </div>
  );
};

export default React.memo(TokenBalancesItem);
