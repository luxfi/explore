import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import InternalTxsList from 'ui/internalTxs/InternalTxsList';
import InternalTxsTable from 'ui/internalTxs/InternalTxsTable';
import useInternalTxsQuery from 'ui/internalTxs/useInternalTxsQuery';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';

const InternalTxs = () => {

  const isMobile = useIsMobile();

  const { query, searchTerm, debouncedSearchTerm, onSearchTermChange } = useInternalTxsQuery();
  const { isError, isPlaceholderData, data, pagination } = query;

  const filterInput = (
    <FilterInput
      className="w-full lg:w-[350px]"
      size="sm"
      onChange={ onSearchTermChange }
      placeholder="Search by transaction hash"
      initialValue={ searchTerm }
    />
  );

  const actionBar = (
    <>
      <div className="mb-6 flex lg:hidden">
        { filterInput }
      </div>
      { (!isMobile || pagination.isVisible) && (
        <ActionBar className="-mt-6">
          <div className="hidden lg:flex">
            { filterInput }
          </div>
          <Pagination className="ml-auto" { ...pagination }/>
        </ActionBar>
      ) }
    </>
  );

  const content = data?.items ? (
    <>
      <div className="lg:hidden">
        <InternalTxsList data={ data.items } isLoading={ isPlaceholderData }/>
      </div>
      <div className="hidden lg:block">
        <InternalTxsTable data={ data.items } isLoading={ isPlaceholderData }/>
      </div>
    </>
  ) : null;

  return (
    <>
      <PageTitle
        title="Internal transactions"
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no internal transactions."
        hasActiveFilters={ Boolean(debouncedSearchTerm) }
        emptyStateProps={{
          term: 'internal transaction',
        }}
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default InternalTxs;
