import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import type { ResourceError } from 'lib/api/resources';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import ResetIconButton from 'ui/shared/ResetIconButton';

import TokenInventoryItem from './TokenInventoryItem';

type Props = {
  inventoryQuery: QueryWithPagesResult<'general:token_inventory'>;
  tokenQuery: UseQueryResult<TokenInfo, ResourceError<unknown>>;
  ownerFilter?: string;
  shouldRender?: boolean;
};

const TokenInventory = ({ inventoryQuery, tokenQuery, ownerFilter, shouldRender = true }: Props) => {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  const resetOwnerFilter = React.useCallback(() => {
    inventoryQuery.onFilterChange({});
  }, [ inventoryQuery ]);

  if (!isMounted || !shouldRender) {
    return null;
  }

  const isActionBarHidden = !ownerFilter && !inventoryQuery.data?.items.length;

  const ownerFilterComponent = ownerFilter && (
    <div
    >
      <span>Filtered by owner</span>
      <div>
        <AddressEntity address={{ hash: ownerFilter }} truncation={ isMobile ? 'constant' : 'none' }/>
        <ResetIconButton onClick={ resetOwnerFilter }/>
      </div>
    </div>
  );

  const actionBar = !isActionBarHidden && (
    <>
      { ownerFilterComponent }
      <ActionBar>
        { isMobile && <Pagination className="ml-auto" { ...inventoryQuery.pagination }/> }
      </ActionBar>
    </>
  );

  const items = inventoryQuery.data?.items;
  const token = tokenQuery.data;

  const content = items && token ? (
    <AddressHighlightProvider>
      <div
       
      >
        { items.map((item, index) => (
          <TokenInventoryItem
            key={ item.id + '_' + index + (inventoryQuery.isPlaceholderData ? '_' + 'placeholder' : '') }
            item={ item }
            isLoading={ inventoryQuery.isPlaceholderData || tokenQuery.isPlaceholderData }
            token={ token }
          />
        )) }
      </div>
    </AddressHighlightProvider>
  ) : null;

  return (
    <DataListDisplay
      isError={ inventoryQuery.isError }
      itemsNum={ items?.length }
      emptyText="There are no tokens."
      hasActiveFilters={ Boolean(ownerFilter) }
      emptyStateProps={{
        description: 'No tokens found for the selected owner.',
      }}
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default TokenInventory;
