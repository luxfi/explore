import React from 'react';

import type * as tac from '@luxfi/tac-operation-lifecycle-types';

import { getTacOperationStage } from 'lib/operations/tac';
import { Tag } from '@luxfi/ui/tag';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import OperationEntity from 'ui/shared/entities/operation/OperationEntity';
import TacOperationStatus from 'ui/shared/statusTag/TacOperationStatus';

interface Props {
  tacOperations: Array<tac.OperationDetails>;
  isLoading: boolean;
  txHash: string;
}

const TxDetailsTacOperation = ({ tacOperations, isLoading, txHash }: Props) => {
  const hasManyItems = tacOperations.length > 1;
  const [ hasScroll, setHasScroll ] = React.useState(false);

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `Hash${ hasManyItems ? 'es' : '' } of the cross‑chain operation${ hasManyItems ? 's' : '' } that this transaction is part of` }
        isLoading={ isLoading }
        hasScroll={ hasScroll }
      >
        Source operation{ hasManyItems ? 's' : '' }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValueWithScroll
        gradientHeight={ 48 }
        onScrollVisibilityChange={ setHasScroll }
      >
        { tacOperations.map((tacOperation) => {
          const tags = [
            ...(getTacOperationStage(tacOperation, txHash) || []),
          ];

          return (
            <div key={ tacOperation.operation_id }>
              <OperationEntity
                id={ tacOperation.operation_id }
                type={ tacOperation.type }
                isLoading={ isLoading }
              />
              { tags.length > 0 && (
                <div>
                  <TacOperationStatus status={ tacOperation.type } isLoading={ isLoading }/>
                  { tags.map((tag) => <Tag key={ tag } loading={ isLoading } className="shrink-0">{ tag }</Tag>) }
                </div>
              ) }
            </div>
          );
        }) }
      </DetailedInfo.ItemValueWithScroll>
    </>
  );
};

export default React.memo(TxDetailsTacOperation);
