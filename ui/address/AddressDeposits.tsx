import { useRouter } from 'next/router';
import React from 'react';

import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import { DEPOSIT } from 'stubs/deposits';
import { generateListStub } from 'stubs/utils';
import BeaconChainDepositsListItem from 'ui/deposits/beaconChain/BeaconChainDepositsListItem';
import BeaconChainDepositsTable from 'ui/deposits/beaconChain/BeaconChainDepositsTable';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};
const AddressDeposits = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'general:address_deposits',
    pathParams: { hash },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'general:address_deposits'>(DEPOSIT, 50, { next_page_params: {
        index: 5,
        items_count: 50,
      } }),
    },
  });

  if (!isMounted || !shouldRender) {
    return null;
  }

  const content = data?.items ? (
    <>
      <div className="lg:hidden">
        { data.items.map((item, index) => (
          <BeaconChainDepositsListItem
            key={ item.index + Number(isPlaceholderData ? index : '') }
            item={ item }
            view="address"
            isLoading={ isPlaceholderData }
          />
        )) }
      </div>
      <div className="hidden lg:block">
        <BeaconChainDepositsTable
          items={ data.items }
          view="address"
          top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isPlaceholderData }
        />
      </div>
    </>
  ) : null ;

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination className="ml-auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ data?.items?.length }
      emptyText="There are no deposits for this address."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default AddressDeposits;
