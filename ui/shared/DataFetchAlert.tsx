import { chakra } from '@chakra-ui/react';
import React from 'react';

import { cn } from 'lib/utils/cn';
import { Alert } from 'toolkit/chakra/alert';

const DataFetchAlert = ({ className }: { className?: string }) => {
  return (
    <Alert status="warning" className={ cn('w-fit', className) }>
      Something went wrong. Try refreshing the page or come back later.
    </Alert>
  );
};

export default chakra(DataFetchAlert);
