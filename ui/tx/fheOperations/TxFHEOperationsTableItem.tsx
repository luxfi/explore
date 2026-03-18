import { capitalize } from 'es-toolkit';
import React from 'react';

import type { FheOperation } from 'types/api/fheOperations';

import { Badge } from 'toolkit/chakra/badge';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { getTypeColor } from 'ui/tx/fheOperations/utils';

type Props = FheOperation & { isLoading?: boolean };

const TxFHEOperationsTableItem = (props: Props) => {
  const { log_index: logIndex, operation, type, fhe_type: fheType, is_scalar: isScalar, hcu_cost: hcuCost, hcu_depth: hcuDepth, caller, isLoading } = props;
  const hcuDepthValue = hcuDepth;

  return (
    <TableRow>
      <TableCell>
        <Skeleton loading={ isLoading }>
          { logIndex }
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          { operation }
        </Skeleton>
      </TableCell>
      <TableCell>
        <Badge colorPalette={ getTypeColor(type) } loading={ isLoading }>
          { capitalize(type) }
        </Badge>
      </TableCell>
      <TableCell>
        <Badge colorPalette="gray" loading={ isLoading }>
          { fheType }
        </Badge>
      </TableCell>
      <TableCell>
        <Badge colorPalette="gray" loading={ isLoading }>
          { isScalar ? 'Scalar' : 'Non-scalar' }
        </Badge>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>
          { hcuCost.toLocaleString() }
        </Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading } color="text.secondary">
          { hcuDepthValue.toLocaleString() }
        </Skeleton>
      </TableCell>
      <TableCell>
        { caller && caller.hash ? (
          <AddressEntity
            address={ caller }
            truncation="dynamic"
            isLoading={ isLoading }
          />
        ) : (
          <span className="text-[var(--color-text-secondary)]">—</span>
        ) }
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxFHEOperationsTableItem);
