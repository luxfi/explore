import React from 'react';

import { Alert } from 'toolkit/chakra/alert';

interface Props {
  isLoading?: boolean;
  className?: string;
}

const ServiceDegradationWarning = ({ isLoading, className }: Props) => {
  return (
    <Alert
      loading={ isLoading }
      status="info"
      className={ className }
      startElement={ <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-4 h-4 my-[3px] shrink-0"/> }
    >
      Data sync in progress... page will refresh automatically once data is available
    </Alert>
  );
};

export default React.memo(ServiceDegradationWarning);
