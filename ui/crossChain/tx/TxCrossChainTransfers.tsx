import React from 'react';

import type { InterchainTransfer } from '@luxfi/interchain-indexer-types';

import DataListDisplay from 'ui/shared/DataListDisplay';

import TokenTransfersCrossChainListItem from '../transfers/TokenTransfersCrossChainListItem';
import TokenTransfersCrossChainTable from '../transfers/TokenTransfersCrossChainTable';
import { getItemKey } from '../transfers/utils';

interface Props {
  data: Array<InterchainTransfer> | undefined;
  isLoading?: boolean;
  isError: boolean;
}

const TxCrossChainTransfers = ({ data, isLoading, isError }: Props) => {
  const content = data ? (
    <>
      <div className="lg:hidden">
        { data.map((item, index) => (
          <TokenTransfersCrossChainListItem
            key={ getItemKey(item, isLoading ? index : undefined) }
            data={ item }
            isLoading={ isLoading }
            py={ 4 }
            textStyle="sm"
            rowGap="14px"
            _first={{
              borderTopWidth: '0',
              paddingTop: '0',
            }}
          />
        )) }
      </div>
      <div className="hidden lg:block">
        <TokenTransfersCrossChainTable data={ data } isLoading={ isLoading }/>
      </div>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.length }
      emptyText="There are no cross-chain token transfers."
      emptyStateProps={{
        term: 'token transfer',
      }}
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(TxCrossChainTransfers);
