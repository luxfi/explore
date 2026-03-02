import React from 'react';

import type { OptimisticL2BlobTypeCelestia } from 'types/api/optimisticL2';

import { layerLabels } from 'lib/rollups/utils';
import CeleniumLink from 'ui/shared/batch/CeleniumLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

interface Props {
  blobs: Array<OptimisticL2BlobTypeCelestia>;
  isLoading: boolean;
}

const OptimisticL2TxnBatchBlobCelestia = ({ blobs, isLoading }: Props) => {
  return (
    <div className="flex flex-col w-full" style={{ rowGap: "8px" }}>
      { blobs.map((blob) => {
        return (
          <OptimisticL2TxnBatchBlobWrapper key={ blob.commitment } isLoading={ isLoading }>
            <div className="font-semibold">Commitment</div>
            <div className="overflow-hidden">
              <div className="flex min-w-0" style={{ width: "calc(100% - 20px)" }}>
                <HashStringShortenDynamic hash={ blob.commitment }/>
                <CopyToClipboard text={ blob.commitment }/>
              </div>
            </div>
            <CeleniumLink commitment={ blob.commitment } namespace={ blob.namespace } height={ blob.height } fallback={ <div/> }/>
            <div className="font-semibold">Height</div>
            <div style={{ gridColumn: "span 2" }}>
              { blob.height }
            </div>
            <div className="font-semibold">Timestamp</div>
            <div className="overflow-hidden" style={{ gridColumn: "span 2" }}>
              <DetailedInfoTimestamp timestamp={ blob.l1_timestamp } isLoading={ isLoading }/>
            </div>
            <div className="font-semibold">{ layerLabels.parent } txn hash</div>
            <div className="overflow-hidden" style={{ gridColumn: "span 2" }}>
              <TxEntityL1 hash={ blob.l1_transaction_hash } noIcon/>
            </div>
          </OptimisticL2TxnBatchBlobWrapper>
        );
      }) }
    </div>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobCelestia);
