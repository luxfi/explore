import React from 'react';

import type { SmartContractConflictingImplementation } from 'types/api/contract';

import { Button } from '@luxfi/ui/button';
import { DialogActionTrigger, DialogBody, DialogContent, DialogHeader, DialogRoot, DialogTrigger } from '@luxfi/ui/dialog';
import { Link } from 'toolkit/next/link';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import { PROXY_TYPES } from './utils';

interface Props {
  data: Array<SmartContractConflictingImplementation>;
  children: React.ReactNode;
}

const ConflictingImplementationsModal = ({ data, children }: Props) => {
  return (
    <DialogRoot size={{ lgDown: 'full', lg: 'md' }}>
      <DialogTrigger>
        { children }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Detected proxy implementations</DialogHeader>
        <DialogBody>
          <span>
            Multiple proxy patterns were detected for this contract.
            This may be due to an unsupported custom proxy design or due to a malicious proxy spoofing attempt.
            Review carefully.
          </span>
          <div className="flex flex-col items-stretch mt-6 text-sm">
            { data.map((item) => {
              const addressNum = item.implementations.length;
              const addressText = addressNum === 1 ? 'Implementation:' : 'Implementations:';
              const proxyType = PROXY_TYPES[item.proxy_type]?.name || PROXY_TYPES.unknown?.name;

              return (
                <div
                  className="grid w-full p-4 gap-x-5 gap-y-2 rounded-md bg-black/5 dark:bg-white/5"
                  style={{ gridTemplateColumns: '115px minmax(0px, 1fr)' }}
                  key={ item.proxy_type }
                >
                  <div>Proxy type:</div>
                  <div>{ proxyType }</div>
                  <div>{ addressText }</div>
                  <div>
                    <div className="flex flex-col items-stretch">
                      { item.implementations.map((implementation) => (
                        <AddressEntity
                          key={ implementation.address_hash }
                          address={{ hash: implementation.address_hash, name: implementation.name }}
                        />
                      )) }
                    </div>
                  </div>
                </div>
              );
            }) }
          </div>
          <div className="flex flex-row mt-6 gap-6">
            <DialogActionTrigger asChild>
              <Button>Got it, thanks</Button>
            </DialogActionTrigger>
            <Link external noIcon href="https://discord.gg/luxnetwork">
              Contact us
            </Link>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default React.memo(ConflictingImplementationsModal);
