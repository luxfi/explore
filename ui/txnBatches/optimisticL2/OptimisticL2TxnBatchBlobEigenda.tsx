import React from 'react';

import type { OptimisticL2BlobTypeEigenda } from 'types/api/optimisticL2';

import { layerLabels } from 'lib/rollups/utils';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

interface Props {
  blobs: Array<OptimisticL2BlobTypeEigenda>;
  isLoading: boolean;
}

const OptimisticL2TxnBatchBlobEigenda = ({ blobs, isLoading }: Props) => {
  return (
    <div className="flex flex-col w-full" style={{ rowGap: "8px" }}>
      { blobs.map((blob) => {
        return (
          <OptimisticL2TxnBatchBlobWrapper key={ blob.cert } isLoading={ isLoading }>
            <div className="font-semibold">Cert</div>
            <div className="overflow-hidden">
              <div className="flex min-w-0" style={{ width: "calc(100% - 20px)" }}>
                <HashStringShortenDynamic hash={ blob.cert }/>
                <CopyToClipboard text={ blob.cert }/>
              </div>
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

export default React.memo(OptimisticL2TxnBatchBlobEigenda);
