import React from 'react';

import StatsWidget from 'ui/shared/stats/StatsWidget';

interface Props {
  totalHcu: number;
  maxDepthHcu: number;
  operationCount: number;
  isLoading?: boolean;
}

const TxFHEOperationsStats = ({ totalHcu, maxDepthHcu, operationCount, isLoading }: Props) => {
  return (
    <div
     
    >
      <StatsWidget
        label="Total HCU"
        hint="Sum of all Homomorphic Computation Units consumed by FHE operations in this transaction"
        value={ (totalHcu || 0).toLocaleString() }
        isLoading={ isLoading }
      />
      <StatsWidget
        label="Max Depth HCU"
        hint="Maximum HCU consumed at any single depth level in the FHE operation tree"
        value={ (maxDepthHcu || 0).toLocaleString() }
        isLoading={ isLoading }
      />
      <StatsWidget
        label="Operations"
        hint="Total number of FHE operations executed in this transaction"
        value={ operationCount.toLocaleString() }
        isLoading={ isLoading }
      />
    </div>
  );
};

export default React.memo(TxFHEOperationsStats);
