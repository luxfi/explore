import React from 'react';

import { cn } from 'lib/utils/cn';
import { Badge } from 'toolkit/chakra/badge';

interface Props {
  type: 'in' | 'out';
  isLoading?: boolean;
  className?: string;
}

const CrossChainFromToTag = ({ type, isLoading, className }: Props) => {
  return (
    <Badge
      loading={ isLoading }
      colorPalette={ type === 'in' ? 'purple' : 'orange' }
      className={ cn('min-w-8 justify-center', className) }
    >
      { type === 'in' ? 'In' : 'Out' }
    </Badge>
  );
};

export default React.memo(CrossChainFromToTag);
