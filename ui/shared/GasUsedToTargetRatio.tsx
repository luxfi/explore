import React from 'react';

import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';

type Props = {
  value: number;
  isLoading?: boolean;
};

const GasUsedToTargetRatio = ({ value, isLoading }: Props) => {
  return (
    <Tooltip content="% of Gas Target">
      <Skeleton color="text.secondary" loading={ isLoading }>
        <span>{ (value > 0 ? '+' : '') + value.toLocaleString(undefined, { maximumFractionDigits: 2 }) }%</span>
      </Skeleton>
    </Tooltip>
  );
};

export default React.memo(GasUsedToTargetRatio);
