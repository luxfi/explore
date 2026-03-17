import React from 'react';

import type { MethodType } from './types';

import { ButtonGroupRadio, Button } from 'toolkit/chakra/button';
import { FilterInput } from 'toolkit/components/filters/FilterInput';

import type { MethodsFilters } from './useMethodsFilters';
import { TYPE_FILTER_OPTIONS } from './utils';

interface Props {
  defaultMethodType: MethodType;
  defaultSearchTerm: string;
  onChange: (filter: MethodsFilters) => void;
  isLoading?: boolean;
}

const ContractMethodsFilters = ({ defaultMethodType, defaultSearchTerm, onChange, isLoading }: Props) => {

  const handleTypeChange = React.useCallback((value: string) => {
    onChange({ type: 'method_type', value: value as MethodType });
  }, [ onChange ]);

  const handleSearchTermChange = React.useCallback((value: string) => {
    onChange({ type: 'method_name', value });
  }, [ onChange ]);

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <ButtonGroupRadio
        defaultValue={ defaultMethodType }
        onChange={ handleTypeChange }
        className="lg:w-fit"
        loading={ isLoading }
      >
        { TYPE_FILTER_OPTIONS.map((option) => (
          <Button key={ option.value } value={ option.value } size="sm" className="px-3">
            { option.title }
          </Button>
        )) }
      </ButtonGroupRadio>
      <FilterInput
        initialValue={ defaultSearchTerm }
        onChange={ handleSearchTermChange }
        placeholder="Search by method name"
        className="w-full lg:w-[450px]"
        size="sm"
        loading={ isLoading }
      />
    </div>
  );
};

export default React.memo(ContractMethodsFilters);
