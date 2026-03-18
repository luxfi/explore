import { useRouter } from 'next/router';
import React from 'react';

import type { EntityTag as TEntityTag, EntityTagType } from 'ui/shared/EntityTags/types';

import getQueryParamString from 'lib/router/getQueryParamString';
import { TOP_ADDRESS } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressesLabelSearchListItem from 'ui/addressesLabelSearch/AddressesLabelSearchListItem';
import AddressesLabelSearchTable from 'ui/addressesLabelSearch/AddressesLabelSearchTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import EntityTag from 'ui/shared/EntityTags/EntityTag';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const AccountsLabelSearch = () => {

  const router = useRouter();
  const slug = getQueryParamString(router.query.slug);
  const tagType = getQueryParamString(router.query.tagType);
  const tagName = getQueryParamString(router.query.tagName);

  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'general:addresses_metadata_search',
    filters: {
      slug,
      tag_type: tagType,
    },
    options: {
      placeholderData: generateListStub<'general:addresses_metadata_search'>(
        TOP_ADDRESS,
        50,
        {
          next_page_params: null,
        },
      ),
    },
  });

  const content = data?.items ? (
    <>
      <div className="hidden lg:block">
        <AddressesLabelSearchTable
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          items={ data.items }
          isLoading={ isPlaceholderData }
        />
      </div>
      <div className="lg:hidden">
        { data.items.map((item, index) => {
          return (
            <AddressesLabelSearchListItem
              key={ item.hash + (isPlaceholderData ? index : '') }
              item={ item }
              isLoading={ isPlaceholderData }
            />
          );
        }) }
      </div>
    </>
  ) : null;

  const text = (() => {
    if (isError) {
      return null;
    }

    const num = data?.items.length || 0;

    const tagData: TEntityTag = {
      tagType: tagType as EntityTagType,
      slug,
      name: tagName || slug,
      ordinal: 0,
    };

    return (
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
        <Skeleton loading={ isPlaceholderData } display="inline-block">
          Found{ ' ' }
          <span className="font-bold">
            { num }{ data?.next_page_params || pagination.page > 1 ? '+' : '' }
          </span>{ ' ' }
          matching result{ num > 1 ? 's' : '' } for
        </Skeleton>
        <EntityTag data={ tagData } isLoading={ isPlaceholderData } noLink/>
      </div>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Search result" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText={ text }
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default AccountsLabelSearch;
