import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/multichain';
import type { HomeStatsItem } from 'ui/home/utils';
import { sortHomeStatsItems, isHomeStatsItemEnabled } from 'ui/home/utils';
import StatsWidget from 'ui/shared/stats/StatsWidget';

import ChainIndicators from './ChainIndicators';

const Stats = () => {
  const statsQuery = useApiQuery('multichainStats:pages_main', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const items: Array<HomeStatsItem> = React.useMemo(() => {
    return [
      statsQuery.data?.total_multichain_txns && {
        id: 'total_txs' as const,
        label: statsQuery.data.total_multichain_txns.title,
        value: Number(statsQuery.data.total_multichain_txns.value).toLocaleString(),
        icon: 'transactions' as const,
        hint: statsQuery.data.total_multichain_txns.description,
      },
      statsQuery.data?.total_multichain_addresses && {
        id: 'wallet_addresses' as const,
        label: statsQuery.data.total_multichain_addresses.title,
        value: Number(statsQuery.data.total_multichain_addresses.value).toLocaleString(),
        icon: 'wallet' as const,
        hint: statsQuery.data.total_multichain_addresses.description,
      },
    ]
      .filter(Boolean)
      .filter(isHomeStatsItemEnabled)
      .sort(sortHomeStatsItems);
  }, [ statsQuery.data ]);

  return (
    <div className="flex flex-col lg:flex-row mt-6 gap-2">
      { items.length > 0 && (
        <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-[270px]">
          { items.map((item) => (
            <StatsWidget
              key={ item.id }
              label={ item.label }
              value={ item.value }
              icon={ item.icon }
              isLoading={ statsQuery.isPlaceholderData }
              hint={ item.hint }
              className="w-[calc((100%-8px)/2)] lg:w-full"
            />
          )) }
        </div>
      ) }
      <ChainIndicators/>
    </div>
  );
};

export default React.memo(Stats);
