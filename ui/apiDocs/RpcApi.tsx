import React from 'react';

import config from 'configs/app';
import { getCurrentChain } from 'configs/app/chainRegistry';
import { Link } from 'toolkit/next/link';

const RpcApi = () => {
  const chain = getCurrentChain();
  const docsUrl = config.UI.navigation.otherLinks?.find((l) => l.text?.toLowerCase().includes('docs'))?.url;

  return (
    <div>
      <span>
        This API is provided for developers building applications on { chain.branding.brandName } requiring general API and data support.
        It supports GET and POST requests.
      </span>
      { docsUrl && <Link href={ `${ docsUrl }/api/rpc` } external className="mt-6">View modules</Link> }
    </div>
  );
};

export default React.memo(RpcApi);
