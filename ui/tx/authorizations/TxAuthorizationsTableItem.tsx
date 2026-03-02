import React from 'react';

import type { TxAuthorization } from 'types/api/transaction';

import config from 'configs/app';
import { Skeleton } from '@luxfi/ui/skeleton';
import { TableRow, TableCell } from '@luxfi/ui/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxAuthorizationStatus from 'ui/shared/statusTag/TxAuthorizationStatus';

interface Props extends TxAuthorization {
  isLoading?: boolean;
}

const TxAuthorizationsItem = ({ address_hash: addressHash, authority, chain_id: chainId, nonce, isLoading, status }: Props) => {
  return (
    <TableRow>
      <TableCell>
        <div>
          <AddressEntity address={{ hash: addressHash }} isLoading={ isLoading } noIcon/>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <AddressEntity address={{ hash: authority }} isLoading={ isLoading } noIcon/>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          { chainId === Number(config.chain.id) ? 'this' : 'any' }
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          { nonce }
        </Skeleton>
      </TableCell>
      <TableCell>
        <TxAuthorizationStatus status={ status } loading={ isLoading }/>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxAuthorizationsItem);
