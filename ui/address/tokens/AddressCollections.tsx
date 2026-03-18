import React from 'react';

import type { NFTTokenType } from 'types/api/token';

import { route } from 'nextjs/routes';

import { useMultichainContext } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import NftFallback from 'ui/shared/nft/NftFallback';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import AddressNftTypeFilter from './AddressNftTypeFilter';
import NFTItem from './NFTItem';
import NFTItemContainer from './NFTItemContainer';

type Props = {
  collectionsQuery: QueryWithPagesResult<'general:address_collections'>;
  address: string;
  tokenTypes: Array<NFTTokenType> | undefined;
  onTokenTypesChange: (value: Array<NFTTokenType>) => void;
};

const AddressCollections = ({ collectionsQuery, address, tokenTypes, onTokenTypesChange }: Props) => {
  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();

  const { isError, isPlaceholderData, data, pagination } = collectionsQuery;

  const hasActiveFilters = Boolean(tokenTypes?.length);

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar className="-mt-6">
      <AddressNftTypeFilter value={ tokenTypes } onChange={ onTokenTypesChange }/>
      <Pagination className="ml-auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? data?.items.filter((item) => item.token_instances.length > 0).map((item, index) => {
    const collectionUrl = route({
      pathname: '/token/[hash]',
      query: {
        hash: item.token.address_hash,
        tab: 'inventory',
        holder_address_hash: address,
        scroll_to_tabs: 'true',
      },
    }, { chain: multichainContext?.chain });
    const hasOverload = Number(item.amount) > item.token_instances.length;
    return (
      <div key={ item.token.address_hash + index } className="mb-6">
        <div className="flex flex-wrap mb-3 leading-[30px]">
          <TokenEntity
            className="w-auto font-semibold"
            noSymbol
            token={ item.token }
            isLoading={ isPlaceholderData }
            noCopy
            chain={ multichainContext?.chain }
          />
          <Skeleton loading={ isPlaceholderData } mr={ 3 }>
            <span className="text-[var(--color-text-secondary)] whitespace-pre">{ ` - ${ Number(item.amount).toLocaleString() } item${ Number(item.amount) > 1 ? 's' : '' }` }</span>
          </Skeleton>
          <Link href={ collectionUrl } loading={ isPlaceholderData }>
            View in collection
          </Link>
        </div>
        <div className="grid w-full mb-6 gap-x-3 lg:gap-x-6 gap-y-3 lg:gap-y-6"

        >
          { item.token_instances.map((instance, index) => {
            const key = item.token.address_hash + '_' + (instance.id && !isPlaceholderData ? `id_${ instance.id }` : `index_${ index }`);

            return (
              <NFTItem
                key={ key }
                { ...instance }
                token={ item.token }
                isLoading={ isPlaceholderData }
                chain={ multichainContext?.chain }
              />
            );
          }) }
          { hasOverload && (
            <Link href={ collectionUrl }>
              <NFTItemContainer className="flex items-center justify-center flex-col min-h-[248px]">
                <div className="flex flex-row gap-2 mb-3">
                  <NftFallback className="w-[30px] h-[30px] p-0"/>
                  <NftFallback className="w-[30px] h-[30px] p-0"/>
                  <NftFallback className="w-[30px] h-[30px] p-0"/>
                </div>
                View all NFTs
              </NFTItemContainer>
            </Link>
          ) }
        </div>
      </div>
    );
  }) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.items?.length }
      emptyText="There are no tokens of selected type."
      actionBar={ actionBar }
      hasActiveFilters={ hasActiveFilters }
      emptyStateProps={{
        term: 'token',
      }}
    >
      { content }
    </DataListDisplay>
  );
};

export default AddressCollections;
