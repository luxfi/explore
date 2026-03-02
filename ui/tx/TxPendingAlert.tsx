import React from 'react';

import { Alert } from '@luxfi/ui/alert';

const TxPendingAlert = () => {
  return (
    <Alert startElement={ <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4 my-1"/> }>
      This transaction is pending confirmation.
    </Alert>
  );
};

export default TxPendingAlert;
