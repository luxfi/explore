import React from 'react';

import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  children?: React.ReactNode;
}

const LogIndex = ({ children, isLoading, className, ...props }: Props) => {
  return (
    <Tooltip content="Log index">
      <Skeleton loading={ isLoading } className="inline-block">
        <div
          className={ `flex items-center justify-center rounded px-2 text-gray-600 dark:text-gray-50 bg-gray-100 dark:bg-gray-600 ${ className ?? '' }`.trim() }
          { ...props }
        >
          { children }
        </div>
      </Skeleton>
    </Tooltip>
  );
};

export default React.memo(LogIndex);
