import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';
import type { PaginationParams } from 'ui/shared/pagination/types';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';

import ERC20TokensListItem from './ERC20TokensListItem';
import ERC20TokensTable from './ERC20TokensTable';

type Props = {
  items: Array<Pick<AddressTokenBalance, 'token' | 'value'>> | undefined;
  isLoading: boolean;
  pagination: PaginationParams;
  isError: boolean;
  top?: number;
};

const ERC20Tokens = ({ items, isLoading, pagination, isError, top }: Props) => {
  const isMobile = useIsMobile();

  const hasAdditionalTokenTypes = config.chain.additionalTokenTypes.length > 0;

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination className="ml-auto" { ...pagination }/>
    </ActionBar>
  );

  const content = items ? (
    <>
      <div className="hidden lg:block">
        <ERC20TokensTable
          data={ items }
          top={ top ?? (pagination.isVisible ? 72 : 0) }
          isLoading={ isLoading }
          hasAdditionalTokenTypes={ hasAdditionalTokenTypes }/>
      </div>
      <div className="lg:hidden">{ items.map((item, index) => (
        <ERC20TokensListItem
          key={ item.token.address_hash + (isLoading ? index : '') }
          { ...item }
          isLoading={ isLoading }
          hasAdditionalTokenTypes={ hasAdditionalTokenTypes }
        />
      )) }
      </div>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ items?.length }
      emptyText="There are no tokens of selected type."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );

};

export default ERC20Tokens;
