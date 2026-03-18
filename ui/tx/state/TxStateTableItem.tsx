import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

import { getStateElements } from './utils';

interface Props {
  data: TxStateChange;
  isLoading?: boolean;
}

const TxStateTableItem = ({ data, isLoading }: Props) => {
  const { before, after, change, tag, tokenId } = getStateElements(data, isLoading);

  return (
    <TableRow>
      <TableCell>
        <div>
          { tag }
        </div>
      </TableCell>
      <TableCell>
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
        />
      </TableCell>
      <TableCell isNumeric><div>{ before }</div></TableCell>
      <TableCell isNumeric><div>{ after }</div></TableCell>
      <TableCell isNumeric><div>{ change }</div></TableCell>
      <TableCell>{ tokenId }</TableCell>
    </TableRow>
  );
};

export default React.memo(TxStateTableItem);
