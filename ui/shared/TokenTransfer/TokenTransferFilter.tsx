import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import type { TokenType } from 'types/api/token';
import type { ClusterChainConfig } from 'types/multichain';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { Radio, RadioGroup } from 'toolkit/chakra/radio';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';

interface Props {
  appliedFiltersNum?: number;
  defaultTypeFilters: Array<TokenType> | undefined;
  onTypeFilterChange: (nextValue: Array<TokenType>) => void;
  withAddressFilter?: boolean;
  onAddressFilterChange?: (nextValue: string) => void;
  defaultAddressFilter?: AddressFromToFilter;
  isLoading?: boolean;
  chainConfig?: Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'];
}

const TokenTransferFilter = ({
  onTypeFilterChange,
  defaultTypeFilters,
  appliedFiltersNum,
  withAddressFilter,
  onAddressFilterChange,
  defaultAddressFilter,
  isLoading,
  chainConfig,
}: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  const handleAddressFilterChange = React.useCallback(({ value }: { value: string | null }) => {
    if (!value) {
      return;
    }

    onAddressFilterChange?.(value);
  }, [ onAddressFilterChange ]);

  return (
    <PopoverFilter appliedFiltersNum={ appliedFiltersNum } contentProps={{ className: 'w-[220px]' }} isLoading={ isInitialLoading }>
      { withAddressFilter && (
        <>
          <span className="text-[var(--color-text-secondary)] font-semibold">Address</span>
          <RadioGroup
            size="lg"
            onValueChange={ handleAddressFilterChange }
            defaultValue={ defaultAddressFilter || 'all' }
            className="pb-4 border-b border-solid border-[var(--color-border-divider)]"
          >
            <div className="flex flex-col gap-4">
              <Radio value="all"><span className="text-base">All</span></Radio>
              <Radio value="from"><span className="text-base">Outgoing transfers</span></Radio>
              <Radio value="to"><span className="text-base">Incoming transfers</span></Radio>
            </div>
          </RadioGroup>
        </>
      ) }
      <TokenTypeFilter<TokenType>
        onChange={ onTypeFilterChange }
        defaultValue={ defaultTypeFilters }
        nftOnly={ false }
        chainConfig={ chainConfig }
      />
    </PopoverFilter>
  );
};

export default React.memo(TokenTransferFilter);
