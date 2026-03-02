import { capitalize } from 'es-toolkit';
import React from 'react';

import type { FheOperation } from 'types/api/fheOperations';

import { Badge } from '@luxfi/ui/badge';
import { Skeleton } from '@luxfi/ui/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import { getTypeColor } from 'ui/tx/fheOperations/utils';

type Props = FheOperation & { isLoading?: boolean };

const TxFHEOperationsListItem = (props: Props) => {
  const { log_index: logIndex, operation, type, fhe_type: fheType, is_scalar: isScalar, hcu_cost: hcuCost, hcu_depth: hcuDepth, caller, isLoading } = props;

  return (
    <ListItemMobile>
      <div>
        <Badge colorPalette={ getTypeColor(type) } loading={ isLoading }>
          { capitalize(type) }
        </Badge>
        <Badge colorPalette="gray" loading={ isLoading }>
          { fheType }
        </Badge>
        <Badge colorPalette="gray" loading={ isLoading }>
          { isScalar ? 'Scalar' : 'Non-scalar' }
        </Badge>
      </div>

      <div>
        <span>Index</span>
        <Skeleton loading={ isLoading } color="text.secondary">
          { logIndex }
        </Skeleton>

        <span>Operation</span>
        <Skeleton loading={ isLoading } color="text.secondary">
          { operation }
        </Skeleton>

        <span>HCU cost</span>
        <Skeleton loading={ isLoading } color="text.secondary">
          { hcuCost.toLocaleString() }
        </Skeleton>

        <span>HCU depth</span>
        <Skeleton loading={ isLoading } color="text.secondary">
          { hcuDepth.toLocaleString() }
        </Skeleton>

        <span>Caller</span>
        <div>
          { caller && caller.hash ? (
            <AddressEntity
              address={ caller }
              truncation="constant"
              isLoading={ isLoading }
            />
          ) : (
            <span className="text-[var(--color-text-secondary)]">—</span>
          ) }
        </div>
      </div>
    </ListItemMobile>
  );
};

export default React.memo(TxFHEOperationsListItem);
