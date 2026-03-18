import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { L2_DISPUTE_GAMES_ITEM } from 'stubs/L2';
import { generateListStub } from 'stubs/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import OptimisticL2DisputeGamesListItem from 'ui/disputeGames/optimisticL2/OptimisticL2DisputeGamesListItem';
import OptimisticL2DisputeGamesTable from 'ui/disputeGames/optimisticL2/OptimisticL2DisputeGamesTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';

const OptimisticL2DisputeGames = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'general:optimistic_l2_dispute_games',
    options: {
      placeholderData: generateListStub<'general:optimistic_l2_dispute_games'>(
        L2_DISPUTE_GAMES_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            index: 9045200,
          },
        },
      ),
    },
  });

  const countersQuery = useApiQuery('general:optimistic_l2_dispute_games_count', {
    queryOptions: {
      placeholderData: 50617,
    },
  });

  const content = data?.items ? (
    <>
      <div className="lg:hidden">
        { data.items.map(((item, index) => (
          <OptimisticL2DisputeGamesListItem
            key={ item.index + (isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </div>
      <div className="hidden lg:block">
        <OptimisticL2DisputeGamesTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </div>
    </>
  ) : null;

  const text = (() => {
    if (countersQuery.isError || isError || !data?.items.length) {
      return null;
    }

    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isPlaceholderData } display="flex" className="flex-wrap">
        Dispute game index
        <span className="whitespace-pre font-semibold"> #{ data.items[0].index } </span>to
        <span className="whitespace-pre font-semibold"> #{ data.items[data.items.length - 1].index } </span>
        (total of { countersQuery.data?.toLocaleString() } games)
      </Skeleton>
    );
  })();

  const actionBar = <StickyPaginationWithText text={ text } pagination={ pagination }/>;

  return (
    <>
      <PageTitle title="Dispute games" withTextAd/>
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no dispute games."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default OptimisticL2DisputeGames;
