import React from 'react';

import { cn } from 'lib/utils/cn';
import { Alert } from '@luxfi/ui/alert';

const DataFetchAlert = ({ className }: { className?: string }) => {
  return (
    <Alert status="warning" className={ cn('w-fit', className) }>
      Something went wrong. Try refreshing the page or come back later.
    </Alert>
  );
};

export default DataFetchAlert;
