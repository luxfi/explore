import { useRouter } from 'next/router';
import React from 'react';

import { useMultichainContext } from 'lib/contexts/multichain';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import PageTitle from 'ui/shared/Page/PageTitle';
import Sol2UmlDiagram from 'ui/sol2uml/Sol2UmlDiagram';

const Sol2Uml = () => {
  const router = useRouter();
  const multichainContext = useMultichainContext();

  const addressHash = router.query.address?.toString() || '';

  const chainInfo = multichainContext?.chain ? (
    <div className="items-center inline-flex">
      <span>on</span>
      <ChainIcon data={ multichainContext.chain } ml={ 1 } mr={ 2 }/>
      <span>{ multichainContext.chain.app_config.chain.name }</span>
    </div>
  ) : null;

  return (
    <>
      <PageTitle title="Solidity UML diagram"/>
      <div className="flex flex-wrap mb-10 gap-x-1">
        <span>For contract</span>
        <AddressEntity
          address={{ hash: addressHash, is_contract: true }}
          noCopy
        />
        { chainInfo }
      </div>
      <Sol2UmlDiagram addressHash={ addressHash }/>
    </>
  );
};

export default Sol2Uml;
