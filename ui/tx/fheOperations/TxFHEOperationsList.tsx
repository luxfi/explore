import React from 'react';

import type { FheOperation } from 'types/api/fheOperations';

import TxFHEOperationsListItem from 'ui/tx/fheOperations/TxFHEOperationsListItem';

interface Props {
  data: Array<FheOperation>;
  isLoading?: boolean;
}

const TxFHEOperationsList = ({ data, isLoading }: Props) => {
  return (
    <div className="lg:hidden">
      { data.map((op) => (
        <TxFHEOperationsListItem
          key={ op.log_index }
          { ...op }
          isLoading={ isLoading }
        />
      )) }
    </div>
  );
};

export default React.memo(TxFHEOperationsList);
