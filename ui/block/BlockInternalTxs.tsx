import React from 'react';

import InternalTxsList from 'ui/internalTxs/InternalTxsList';
import InternalTxsTable from 'ui/internalTxs/InternalTxsTable';
import DataListDisplay from 'ui/shared/DataListDisplay';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

interface Props {
  query: QueryWithPagesResult<'general:block_internal_txs'>;
  top?: number;
}

const BlockInternalTxs = ({ query, top }: Props) => {
  const { data, isPlaceholderData, isError } = query;

  const content = data?.items ? (
    <>
      <div className="lg:hidden">
        <InternalTxsList data={ data.items } isLoading={ isPlaceholderData } showBlockInfo={ false }/>
      </div>
      <div className="hidden lg:block">
        <InternalTxsTable data={ data.items } isLoading={ isPlaceholderData } top={ top } showBlockInfo={ false }/>
      </div>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="There are no internal transactions."
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(BlockInternalTxs);
