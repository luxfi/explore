import React from 'react';

import useIsMounted from 'lib/hooks/useIsMounted';
import InternalTxsList from 'ui/internalTxs/InternalTxsList';
import InternalTxsTable from 'ui/internalTxs/InternalTxsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';

import AddressCsvExportLink from './AddressCsvExportLink';
import AddressTxsFilter from './AddressTxsFilter';
import useAddressInternalTxsQuery from './useAddressInternalTxsQuery';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};
const AddressInternalTxs = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const isMounted = useIsMounted();

  const { hash, query, filterValue, onFilterChange } = useAddressInternalTxsQuery({ enabled: isQueryEnabled });
  const { data, isPlaceholderData, isError, pagination } = query;

  if (!isMounted || !shouldRender) {
    return null;
  }

  const content = data?.items ? (
    <>
      <div className="lg:hidden">
        <InternalTxsList data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData }/>
      </div>
      <div className="hidden lg:block">
        <InternalTxsTable data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData }/>
      </div>
    </>
  ) : null ;

  const actionBar = (
    <ActionBar mt={ -6 } justifyContent="left">
      <AddressTxsFilter
        initialValue={ filterValue }
        onFilterChange={ onFilterChange }
        hasActiveFilter={ Boolean(filterValue) }
        isLoading={ pagination.isLoading }
      />
      <AddressCsvExportLink
        address={ hash }
        isLoading={ pagination.isLoading }
        params={{ type: 'internal-transactions', filterType: 'address', filterValue }}
        ml={{ base: 2, lg: 'auto' }}
      />
      <Pagination className="ml-auto lg:ml-8" { ...pagination }/>
    </ActionBar>
  );

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.items.length }
      hasActiveFilters={ Boolean(filterValue) }
      emptyStateProps={{
        term: 'transaction',
      }}
      emptyText="There are no internal transactions for this address."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default AddressInternalTxs;
