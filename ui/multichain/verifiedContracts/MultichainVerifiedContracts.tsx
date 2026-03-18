import React from 'react';

import { MultichainProvider } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ChainSelect from 'ui/multichain/components/ChainSelect';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';
import useVerifiedContractsQuery from 'ui/verifiedContracts/useVerifiedContractsQuery';
import { SORT_OPTIONS } from 'ui/verifiedContracts/utils';
import VerifiedContractsCounters from 'ui/verifiedContracts/VerifiedContractsCounters';
import VerifiedContractsFilter from 'ui/verifiedContracts/VerifiedContractsFilter';
import VerifiedContractsList from 'ui/verifiedContracts/VerifiedContractsList';
import VerifiedContractsTable from 'ui/verifiedContracts/VerifiedContractsTable';
import { createListCollection } from 'toolkit/chakra/select';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const MultichainVerifiedContracts = () => {
  const isMobile = useIsMobile();

  const { query, type, searchTerm, sort, onSearchTermChange, onTypeChange, onSortChange } = useVerifiedContractsQuery({ isMultichain: true });
  const { isError, isPlaceholderData, data, pagination, chainValue, onChainValueChange } = query;

  const typeFilter = (
    <VerifiedContractsFilter
      onChange={ onTypeChange }
      defaultValue={ type }
      hasActiveFilter={ Boolean(type) }
    />
  );

  const filterInput = (
    <FilterInput
      className="w-full lg:w-[350px]"
      size="sm"
      onChange={ onSearchTermChange }
      placeholder="Search by contract name or address"
      initialValue={ searchTerm }
    />
  );

  const sortButton = (
    <Sort
      name="verified_contracts_sorting"
      defaultValue={ [ sort ] }
      collection={ sortCollection }
      onValueChange={ onSortChange }
      isLoading={ isPlaceholderData }
    />
  );

  const actionBar = (
    <>
      <div className="mb-6 gap-3 flex lg:hidden">
        { typeFilter }
        { sortButton }
        { filterInput }
      </div>
      { (!isMobile || pagination.isVisible) && (
        <ActionBar className="-mt-6">
          <div className="flex gap-3 hidden lg:flex">
            { typeFilter }
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
        <VerifiedContractsList data={ data.items } isLoading={ isPlaceholderData }/>
      </div>
      <div className="hidden lg:block">
        <VerifiedContractsTable data={ data.items } sort={ sort } setSorting={ onSortChange } isLoading={ isPlaceholderData }/>
      </div>
    </>
  ) : null;

  return (
    <div>
      <PageTitle
        title="Verified contracts"
        withTextAd
      />
      <ChainSelect
        value={ chainValue }
        onValueChange={ onChainValueChange }
        mode="default"
        className="mb-3"
      />
      <MultichainProvider chainId={ chainValue?.[0] }>
        <VerifiedContractsCounters/>
        <DataListDisplay
          isError={ isError }
          itemsNum={ data?.items.length }
          emptyText="There are no verified contracts."
          hasActiveFilters={ Boolean(searchTerm || type) }
          emptyStateProps={{
            term: 'contract',
          }}
          actionBar={ actionBar }
        >
          { content }
        </DataListDisplay>
      </MultichainProvider>
    </div>
  );
};

export default React.memo(MultichainVerifiedContracts);
