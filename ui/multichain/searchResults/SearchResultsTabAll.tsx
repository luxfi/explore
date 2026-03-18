import React from 'react';

import { route } from 'nextjs/routes';

import { Link } from 'toolkit/chakra/link';

import SearchResultsList from './SearchResultsList';
import type { QueryType, SearchQueries } from './utils';
import { SEARCH_TABS_NAMES, SEARCH_TABS_IDS } from './utils';

const MAX_ITEMS_IN_GROUP = 5;

interface Props {
  queries: SearchQueries;
}

const SearchResultsTabAll = ({ queries }: Props) => {
  return (
    <div className="flex flex-col gap-y-8">
      { Object.entries(queries)
        .filter(([ , query ]) => query.data?.pages?.[0]?.items?.length > 0)
        .filter(([ queryType ]) => SEARCH_TABS_NAMES[queryType as QueryType])
        .map((items) => {
          const queryType = items[0] as QueryType;
          const query = items[1] as SearchQueries[QueryType];

          const hasMore = Number(query.data?.pages[0].items.length) > MAX_ITEMS_IN_GROUP;

          return (
            <div key={ queryType }>
              <span className="text-[var(--color-text-secondary)] mb-2 font-semibold">{ SEARCH_TABS_NAMES[queryType] }</span>
              <SearchResultsList queryType={ queryType } query={ query } maxItems={ MAX_ITEMS_IN_GROUP }/>
              { hasMore && (
                <Link
                  className="pt-2 border-t border-solid border-[var(--color-border-divider)] text-sm w-full"
                  href={ route({ pathname: '/search-results', query: { tab: SEARCH_TABS_IDS[queryType] } }) }
                >
                  View all
                </Link>
              ) }
            </div>
          );
        }) }
    </div>
  );
};

export default React.memo(SearchResultsTabAll);
