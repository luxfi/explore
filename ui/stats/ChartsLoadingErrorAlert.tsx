import React from 'react';

import { Alert } from '@luxfi/ui/alert';
import { Link } from 'toolkit/next/link';
import { apos } from 'toolkit/utils/htmlEntities';

function ChartsLoadingErrorAlert() {
  return (
    <Alert status="warning" className="mb-4" closable>
      <span>
        { `Some of the charts did not load because the server didn${ apos }t respond. To reload charts ` }
        <Link href={ window.document.location.href }>click once again.</Link>
      </span>
    </Alert>
  );
}

export default ChartsLoadingErrorAlert;
