import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import { Badge } from '@luxfi/ui/badge';
import { TableCell, TableRow } from '@luxfi/ui/table';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';
import { TX_INTERNALS_ITEMS } from 'ui/tx/internals/utils';

type Props = InternalTransaction & {
  isLoading?: boolean;
};

const TxInternalTableItem = ({ type, from, to, value, success, error, gas_limit: gasLimit, created_contract: createdContract, isLoading }: Props) => {
  const typeTitle = TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
  const toData = to ? to : createdContract;

  return (
    <TableRow>
      <TableCell>
        <div>
          { typeTitle && (
            <div>
              <Badge colorPalette="cyan" className="mr-5" loading={ isLoading }>{ typeTitle }</Badge>
            </div>
          ) }
          { !success && <TxStatus status="error" errorText={ error } isLoading={ isLoading }/> }
        </div>
      </TableCell>
      <TableCell>
        <AddressFromTo
          from={ from }
          to={ toData }
          isLoading={ isLoading }
        />
      </TableCell>
      <TableCell isNumeric>
        <NativeCoinValue
          amount={ value }
          noSymbol
          loading={ isLoading }
        />
      </TableCell>
      <TableCell isNumeric>
        <NativeCoinValue
          amount={ gasLimit }
          units="wei"
          noSymbol
          loading={ isLoading }
        />
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxInternalTableItem);
