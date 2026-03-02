import { useRouter } from 'next/router';
import React from 'react';

import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TAC_OPERATION } from 'stubs/operations';
import { generateListStub } from 'stubs/utils';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import TacOperationsListItem from 'ui/operations/tac/TacOperationsListItem';
import TacOperationsTable from 'ui/operations/tac/TacOperationsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const TacOperations = () => {
  const router = useRouter();
  const [ searchTerm, setSearchTerm ] = React.useState(getQueryParamString(router.query.q) || undefined);

  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'tac:operations',
    filters: { q: debouncedSearchTerm },
    options: {
      placeholderData: generateListStub<'tac:operations'>(
        TAC_OPERATION,
        50,
        { next_page_params: undefined },
      ),
    },
  });

  const handleSearchTermChange = React.useCallback((value: string) => {
    onFilterChange({ q: value });
    setSearchTerm(value);
  }, [ onFilterChange ]);

  const filterInput = (
    <FilterInput
      className="w-full lg:w-[460px]"
      size="sm"
      onChange={ handleSearchTermChange }
      placeholder="Search by operation, tx hash, sender"
      initialValue={ searchTerm }
    />
  );

  const actionBar = (
    <>
      <div className="mb-6 gap-3 flex lg:hidden">
        { filterInput }
      </div>
      { (!isMobile || pagination.isVisible) && (
        <ActionBar className="-mt-6">
          <div className="flex gap-3 hidden lg:flex">
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
        { data.items.map(((item, index) => (
          <TacOperationsListItem
            key={ String(item.operation_id) + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
          />
        ))) }
      </div>
      <div className="hidden lg:block">
        <TacOperationsTable
          items={ data.items }
          isLoading={ isPlaceholderData }
        />
      </div>
    </>
  ) : null;

  return (
    <>
      <PageTitle title="Operations" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items?.length }
        emptyText="There are no operations."
        hasActiveFilters={ Boolean(debouncedSearchTerm) }
        emptyStateProps={{
          term: 'operation',
        }}
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default React.memo(TacOperations);
