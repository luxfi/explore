import React from 'react';

import type { OptimisticL2BlobTypeEip4844 } from 'types/api/optimisticL2';

import { layerLabels } from 'lib/rollups/utils';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import BlobEntityL1 from 'ui/shared/entities/blob/BlobEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

interface Props {
  blobs: Array<OptimisticL2BlobTypeEip4844>;
  isLoading: boolean;
}

const OptimisticL2TxnBatchBlobEip4844 = ({ blobs, isLoading }: Props) => {
  return (
    <div className="flex flex-col w-full" style={{ rowGap: "8px" }}>
      { blobs.map((blob) => {
        return (
          <OptimisticL2TxnBatchBlobWrapper key={ blob.hash } isLoading={ isLoading }>
            <div className="font-semibold">Versioned hash</div>
            <div className="overflow-hidden">
              <BlobEntityL1 hash={ blob.hash }/>
            </div>
            <div className="font-semibold">Timestamp</div>
            <div className="overflow-hidden">
              <DetailedInfoTimestamp timestamp={ blob.l1_timestamp } isLoading={ isLoading }/>
            </div>
            <div className="font-semibold">{ layerLabels.parent } txn hash</div>
            <div className="overflow-hidden">
              <TxEntityL1 hash={ blob.l1_transaction_hash } noIcon/>
            </div>
          </OptimisticL2TxnBatchBlobWrapper>
        );
      }) }
    </div>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobEip4844);
