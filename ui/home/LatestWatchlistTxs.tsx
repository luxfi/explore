import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import { TX } from 'stubs/tx';
import { Link } from 'toolkit/next/link';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';

import LatestTxsFallback from './fallbacks/LatestTxsFallback';
import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemMobile from './LatestTxsItemMobile';

const LatestWatchlistTxs = () => {
  useRedirectForInvalidAuthToken();
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 5;
  const { data, isPlaceholderData, isError } = useApiQuery('general:homepage_txs_watchlist', {
    queryOptions: {
      placeholderData: Array(txsCount).fill(TX),
    },
  });

  if (isError) {
    return <LatestTxsFallback/>;
  }

  if (!data?.length) {
    return <span>No latest transactions found.</span>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs', query: { tab: 'watchlist' } });
    return (
      <>
        <div className="mb-3 block lg:hidden text-sm">
          { data.slice(0, txsCount).map(((tx, index) => (
            <LatestTxsItemMobile
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </div>
        <div className="mb-4 hidden lg:block text-sm">
          { data.slice(0, txsCount).map(((tx, index) => (
            <LatestTxsItem
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </div>
        <div className="flex justify-center">
          <Link className="text-sm" href={ txsUrl }>View all watch list transactions</Link>
        </div>
      </>
    );
  }

  return null;
};

export default LatestWatchlistTxs;
