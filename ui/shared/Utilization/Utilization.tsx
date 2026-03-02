import { clamp } from 'es-toolkit';
import React from 'react';

import { Skeleton } from '@luxfi/ui/skeleton';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  colorScheme?: 'green' | 'gray';
  isLoading?: boolean;
}

const WIDTH = 50;

const Utilization = ({ value, colorScheme = 'green', isLoading, className, ...rest }: Props, ref: React.Ref<HTMLDivElement>) => {
  const valueString = (clamp(value * 100 || 0, 0, 100)).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '%';
  const color = colorScheme === 'gray' ? 'text.secondary' : 'green.500';

  return (
    <div className={ `flex items-center gap-x-2 ${ className ?? '' }`.trim() } { ...rest } ref={ ref }>
      <Skeleton loading={ isLoading } w={ `${ WIDTH }px` } h="4px" borderRadius="full" className="overflow-hidden">
        <div className="h-full bg-[var(--color-blackAlpha-200)] dark:bg-[var(--color-whiteAlpha-200)]">
          <div className={ `h-full ${ colorScheme === 'gray' ? 'bg-[var(--color-text-secondary)]' : 'bg-[var(--color-green-500)]' }` } style={{ width: valueString }}/>
        </div>
      </Skeleton>
      <Skeleton loading={ isLoading } color={ color } fontWeight="bold" className="font-bold">
        <span>
          { valueString }
        </span>
      </Skeleton>
    </div>
  );
};

export default React.memo(React.forwardRef(Utilization));
