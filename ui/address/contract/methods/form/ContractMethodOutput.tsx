import React from 'react';
import type { AbiFunction } from 'viem';

import type { AbiFallback, ResultViewMode } from '../types';

import { Alert } from '@luxfi/ui/alert';

import ResultItem from './resultPublicClient/Item';

export interface Props {
  data: unknown;
  abiItem: AbiFunction | AbiFallback;
  onSettle: () => void;
  mode: ResultViewMode;
}

const ContractMethodOutput = ({ data, abiItem, onSettle, mode }: Props) => {
  React.useEffect(() => {
    if (mode === 'result') {
      onSettle();
    }
  }, [ onSettle, mode ]);

  const formattedData = (() => {
    return abiItem && abiItem.outputs.length > 1 && Array.isArray(data) ? data : [ data ];
  })();

  return (
    <Alert
      status="info"
      className={ mode === 'preview' ? 'text-gray-500' : undefined }
      descriptionProps={{
        className: 'flex flex-col items-start gap-y-2 whitespace-break-spaces break-all',
      }}
    >
      { abiItem.outputs.map((output, index) => (
        <ResultItem
          key={ index }
          abiParameter={ output }
          data={ formattedData[index] }
          mode={ mode }
        />
      )) }
    </Alert>
  );
};

export default React.memo(ContractMethodOutput);
