import React from 'react';

import config from 'configs/app';
import { getCurrentChain } from 'configs/app/chainRegistry';
import { Link } from 'toolkit/chakra/link';

const EthRpcApi = () => {
  const chain = getCurrentChain();
  const docsUrl = config.UI.navigation.otherLinks?.find((l) => l.text?.toLowerCase().includes('docs'))?.url;

  return (
    <div>
      <span>
        In addition to the custom RPC endpoints documented here,
        the { chain.branding.brandName } Explorer ETH RPC API supports 3 methods in the exact format specified for Ethereum nodes,
        see the Ethereum JSON-RPC Specification for more details.
      </span>
      { docsUrl && <Link href={ `${ docsUrl }/api/eth-rpc` } external className="mt-6">View examples</Link> }
    </div>
  );
};

export default React.memo(EthRpcApi);
