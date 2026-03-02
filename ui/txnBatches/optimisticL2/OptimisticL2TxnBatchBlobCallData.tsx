import React from 'react';

import { layerLabels } from 'lib/rollups/utils';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

import OptimisticL2TxnBatchBlobWrapper from './OptimisticL2TxnBatchBlobWrapper';

interface Props {
  l1TxHashes: Array<string>;
  l1Timestamp: string;
  isLoading: boolean;
}

const OptimisticL2TxnBatchBlobCallData = ({ l1TxHashes, l1Timestamp, isLoading }: Props) => {
  return (
    <OptimisticL2TxnBatchBlobWrapper isLoading={ isLoading }>
      <div className="font-semibold">Timestamp</div>
      <div className="overflow-hidden">
        <DetailedInfoTimestamp timestamp={ l1Timestamp } isLoading={ isLoading }/>
      </div>
      <div className="font-semibold">{ layerLabels.parent } txn hash{ l1TxHashes.length > 1 ? 'es' : '' }</div>
      <div className="overflow-hidden flex flex-col" style={{ rowGap: "8px" }}>
        { l1TxHashes.map((hash) => <TxEntityL1 key={ hash } hash={ hash } noIcon/>) }
      </div>
    </OptimisticL2TxnBatchBlobWrapper>

  );
};

export default React.memo(OptimisticL2TxnBatchBlobCallData);
