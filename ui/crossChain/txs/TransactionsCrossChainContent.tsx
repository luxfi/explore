import React from 'react';

import type { InterchainMessage } from '@luxfi/interchain-indexer-types';
import type { PaginationParams } from 'ui/shared/pagination/types';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import type { Props as DataListDisplayProps } from 'ui/shared/DataListDisplay';
import DataListDisplay from 'ui/shared/DataListDisplay';

import TransactionsCrossChainListItem from './TransactionsCrossChainListItem';
import TransactionsCrossChainTable from './TransactionsCrossChainTable';

export interface Props extends Omit<DataListDisplayProps, 'children'> {
  items?: Array<InterchainMessage>;
  isLoading?: boolean;
  pagination?: PaginationParams;
  isTableView?: boolean;
  stickyHeader?: boolean;
  currentAddress?: string;
}

const TransactionsCrossChainContent = ({ items, isLoading, pagination, isTableView, stickyHeader = true, currentAddress, ...rest }: Props) => {
  const content = items ? (
    <>
      <div className={ isTableView ? 'hidden' : 'block lg:hidden' }>
        { items.map((item, index) => (
          <TransactionsCrossChainListItem
            key={ item.message_id + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }
            currentAddress={ currentAddress }
          />
        )) }
      </div>
      <div className={ `${ isTableView ? 'block' : 'hidden lg:block' } overflow-x-auto lg:overflow-x-visible -mx-3 lg:mx-0 px-3 lg:px-0` }>
        <TransactionsCrossChainTable
          data={ items }
          isLoading={ isLoading }
          top={ ACTION_BAR_HEIGHT_DESKTOP }
          stickyHeader={ stickyHeader }
          currentAddress={ currentAddress }
        />
      </div>
    </>
  ) : null;

  return (
    <DataListDisplay
      itemsNum={ items?.length }
      emptyText="There are no cross-chain transactions."
      emptyStateProps={{
        term: 'transaction',
      }}
      { ...rest }
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(TransactionsCrossChainContent);
