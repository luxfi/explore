import React from 'react';

import type { SmartContractConflictingImplementation, SmartContractProxyType } from 'types/api/contract';

import { Alert } from '@luxfi/ui/alert';
import { Link } from 'toolkit/next/link';
import { space } from 'toolkit/utils/htmlEntities';

import ConflictingImplementationsModal from './ConflictingImplementationsModal';
import { PROXY_TYPES } from './utils';

interface Props {
  type: NonNullable<SmartContractProxyType>;
  isLoading?: boolean;
  conflictingImplementations?: Array<SmartContractConflictingImplementation>;
}

const ContractCodeProxyPattern = ({ type, isLoading, conflictingImplementations }: Props) => {
  const proxyInfo = PROXY_TYPES[type];

  if (!proxyInfo || type === 'unknown') {
    return null;
  }

  const status = conflictingImplementations && conflictingImplementations.length > 0 ? 'warning' : 'success';

  return (
    <Alert status={ status } whiteSpace="pre-wrap" loading={ isLoading } descriptionProps={{ flexDir: 'column' }}>
      { proxyInfo.link ? (
        <div>
          This proxy smart-contract is detected via <Link href={ proxyInfo.link } external>{ proxyInfo.name }</Link>
          { proxyInfo.description && ` - ${ proxyInfo.description }` }
        </div>
      ) : (
        <div>
          This proxy smart-contract is detected via { proxyInfo.name }
          { proxyInfo.description && ` - ${ proxyInfo.description }` }
        </div>
      ) }
      { conflictingImplementations && conflictingImplementations.length > 0 && (
        <div className="mt-1 whitespace-pre-wrap">
          <span>This contract contains more than one proxy implementation address.{ space }</span>
          <ConflictingImplementationsModal data={ conflictingImplementations }>
            <Link>View details</Link>
          </ConflictingImplementationsModal>
        </div>
      ) }
    </Alert>
  );
};

export default React.memo(ContractCodeProxyPattern);
