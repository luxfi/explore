import React from 'react';

import type * as bens from '@luxfi/bens-types';
import type { EnsDomainLookupFiltersOptions } from 'types/api/ens';
import type { PaginationParams } from 'ui/shared/pagination/types';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { cn } from 'lib/utils/cn';
import { Button } from '@luxfi/ui/button';
import { Checkbox, CheckboxGroup } from '@luxfi/ui/checkbox';
import { Image } from '@luxfi/ui/image';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ActionBar from 'ui/shared/ActionBar';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import IconSvg from 'ui/shared/IconSvg';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';

import type { Sort as TSort } from './utils';
import { SORT_OPTIONS } from './utils';
import { createListCollection } from '@luxfi/ui/select';

const sortCollection = createListCollection({ items: SORT_OPTIONS });

interface Props {
  pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  filterValue: EnsDomainLookupFiltersOptions;
  onFilterValueChange: (nextValue: EnsDomainLookupFiltersOptions) => void;
  protocolsData: Array<bens.ProtocolInfo> | undefined;
  protocolsFilterValue: Array<string>;
  onProtocolsFilterChange: (nextValue: Array<string>) => void;
  sort: TSort;
  onSortChange: (nextValue: TSort) => void;
  isLoading: boolean;
  isAddressSearch: boolean;
}

const NameDomainsActionBar = ({
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterValueChange,
  sort,
  onSortChange,
  isLoading,
  isAddressSearch,
  pagination,
  protocolsData,
  protocolsFilterValue,
  onProtocolsFilterChange,
}: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  const searchInput = (
    <FilterInput
      className="w-full lg:w-[360px] min-w-[auto] lg:min-w-[250px]"
      size="sm"
      onChange={ onSearchChange }
      placeholder="Search by name or address"
      initialValue={ searchTerm }
      loading={ isInitialLoading }
    />
  );

  const handleProtocolReset = React.useCallback(() => {
    onProtocolsFilterChange([]);
  }, [ onProtocolsFilterChange ]);

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    onSortChange(value[0] as TSort);
  }, [ onSortChange ]);

  const handleFilterValueChange = React.useCallback((value: Array<string>) => {
    onFilterValueChange(value as EnsDomainLookupFiltersOptions);
  }, [ onFilterValueChange ]);

  const filterGroupDivider = <div className="w-full my-4 border-b border-b-[var(--color-border-divider)]"/>;

  const appliedFiltersNum = filterValue.length + (protocolsData && protocolsData.length > 1 ? protocolsFilterValue.length : 0);

  const filter = (
    <PopoverFilter appliedFiltersNum={ appliedFiltersNum } contentProps={{ className: 'min-w-[220px] w-fit' }} isLoading={ isInitialLoading }>
      <div>
        { protocolsData && protocolsData.length > 1 && (
          <>
            <div className="flex justify-between mb-3">
              <span className="text-[var(--color-text-secondary)] font-semibold">Protocol</span>
              <Button
                variant="link"
                onClick={ handleProtocolReset }
                disabled={ protocolsFilterValue.length === 0 }
                className="text-sm"
              >
                Reset
              </Button>
            </div>
            <CheckboxGroup defaultValue={ protocolsFilterValue } onValueChange={ onProtocolsFilterChange } value={ protocolsFilterValue } name="token_type">
              { protocolsData.map((protocol) => {
                const topLevelDomains = protocol.tld_list.map((domain) => `.${ domain }`).join(' ');
                return (
                  <Checkbox key={ protocol.id } value={ protocol.id }>
                    <div className="flex items-center">
                      <Image
                        src={ protocol.icon_url }
                        boxSize={ 5 }
                        borderRadius="sm"
                        mr={ 2 }
                        alt={ `${ protocol.title } protocol icon` }
                        fallback={ <IconSvg name="ENS"/> }
                      />
                      <span>{ protocol.short_name }</span>
                      <span className="whitespace-pre text-[var(--color-text-secondary)]"> { topLevelDomains }</span>
                    </div>
                  </Checkbox>
                );
              }) }
            </CheckboxGroup>
            { filterGroupDivider }
          </>
        ) }
        <fieldset>
          <CheckboxGroup defaultValue={ filterValue } onValueChange={ handleFilterValueChange } value={ filterValue } name="token_type">
            <div>
              <span className="text-[var(--color-text-secondary)] mb-3 font-semibold">Address</span>
              <Checkbox value="owned_by" disabled={ !isAddressSearch }>
                Owned by
              </Checkbox>
              <Checkbox
                value="resolved_to"
                className="mt-3"
                disabled={ !isAddressSearch }
              >
                Resolved to address
              </Checkbox>
              { filterGroupDivider }
              <span className="text-[var(--color-text-secondary)] mb-3 font-semibold">Status</span>
              <Checkbox value="with_inactive">
                Include expired
              </Checkbox>
            </div>
          </CheckboxGroup>
        </fieldset>
      </div>
    </PopoverFilter>
  );

  const sortButton = (
    <Sort
      name="name_domains_sorting"
      defaultValue={ [ sort ] }
      collection={ sortCollection }
      onValueChange={ handleSortChange }
      isLoading={ isInitialLoading }
    />
  );

  return (
    <>
      <div className="flex lg:hidden mb-6 gap-3">
        { filter }
        { sortButton }
        { searchInput }
      </div>
      <ActionBar
        className={ cn('-mt-6', pagination.isVisible ? 'flex' : 'hidden', 'lg:flex') }
      >
        <div className="flex hidden lg:block gap-3">
          { filter }
          { searchInput }
        </div>
        <Pagination { ...pagination } className="ml-auto"/>
      </ActionBar>
    </>
  );
};

export default React.memo(NameDomainsActionBar);
