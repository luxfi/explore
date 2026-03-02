import React from 'react';

import type { TokenInfo } from 'types/api/token';

import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import TokenHoldersList from './TokenHoldersList';
import TokenHoldersTable from './TokenHoldersTable';

const TABS_HEIGHT = 88;

type Props = {
  token?: TokenInfo;
  holdersQuery: QueryWithPagesResult<'general:token_holders'>;
  shouldRender?: boolean;
  tabsHeight?: number;
};

const TokenHolders = ({ holdersQuery, token, shouldRender = true, tabsHeight = TABS_HEIGHT }: Props) => {
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  if (!isMounted || !shouldRender) {
    return null;
  }

  if (holdersQuery.isError) {
    return <DataFetchAlert/>;
  }

  const actionBar = isMobile && holdersQuery.pagination.isVisible && (
    <ActionBar>
      { token && (
        <AddressCsvExportLink
          address={ token.address_hash }
          params={{ type: 'holders' }}
          isLoading={ holdersQuery.pagination.isLoading }
        />
      ) }
      <Pagination className="ml-auto" { ...holdersQuery.pagination }/>
    </ActionBar>
  );

  const items = holdersQuery.data?.items;

  const content = items && token ? (
    <>
      <div>
        <TokenHoldersTable
          data={ items }
          token={ token }
          top={ tabsHeight }
          isLoading={ holdersQuery.isPlaceholderData }
        />
      </div>
      <div>
        <TokenHoldersList
          data={ items }
          token={ token }
          isLoading={ holdersQuery.isPlaceholderData }
        />
      </div>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ holdersQuery.isError }
      itemsNum={ holdersQuery.data?.items.length }
      emptyText="There are no holders for this token."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default TokenHolders;
