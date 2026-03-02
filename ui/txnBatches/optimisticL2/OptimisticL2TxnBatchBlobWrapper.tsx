import React from 'react';

import { cn } from 'lib/utils/cn';

interface Props {
  children: React.ReactNode;
  className?: string;
  isLoading: boolean;
  gridTemplateColumns?: string;
}

const OptimisticL2TxnBatchBlobWrapper = ({ children, className, isLoading, gridTemplateColumns }: Props) => {
  return (
    <div
      className={ cn(
        'grid gap-x-3 gap-y-[10px] p-4 bg-black/5 dark:bg-white/10 rounded w-full text-sm',
        className,
      ) }
      style={{
        gridTemplateColumns: gridTemplateColumns || 'auto 1fr',
        height: isLoading ? '140px' : undefined,
      }}
    >
      { isLoading ? null : children }
    </div>
  );
};

export default React.memo(OptimisticL2TxnBatchBlobWrapper);
