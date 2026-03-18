import React from 'react';

import { route } from 'nextjs-routes';

import multichainConfig from 'configs/multichain';
import useApiQuery from 'lib/api/useApiQuery';
import { MultichainProvider } from 'lib/contexts/multichain';
import { Link } from 'toolkit/chakra/link';
import HeroBanner from 'ui/home/HeroBanner';

import ChainWidget from './ChainWidget';
import LatestTxs from './LatestTxs';
import Stats from './Stats';

const MultichainHome = () => {
  const chains = multichainConfig()?.chains;

  const chainMetricsQuery = useApiQuery('multichainAggregator:chain_metrics');

  return (
    <main>
      <HeroBanner/>
      <Stats/>
      <LatestTxs/>
      { chains && chains.length > 0 && (
        <div className="flex flex-col gap-y-3 items-stretch">
          <div className="flex gap-2 lg:gap-3 w-full flex-wrap items-stretch">
            { chains.slice(0, 4).map((chain) => (
              <MultichainProvider key={ chain.id } chainId={ chain.id }>
                <ChainWidget
                  data={ chain }
                  isLoading={ chainMetricsQuery.isLoading }
                  metrics={ chainMetricsQuery.data?.items.find((metric) => metric.chain_id === chain.id) }
                />
              </MultichainProvider>
            )) }
          </div>
          <Link className="text-sm justify-center" href={ route({ pathname: '/ecosystems' }) }>View all chains</Link>
        </div>
      ) }
    </main>
  );
};

export default React.memo(MultichainHome);
