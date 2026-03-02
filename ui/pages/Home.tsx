import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { HomeRpcDataContextProvider } from 'ui/home/fallbacks/rpcDataContext';
import HeroBanner from 'ui/home/HeroBanner';
import Highlights from 'ui/home/Highlights';
import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestArbitrumL2Batches from 'ui/home/latestBatches/LatestArbitrumL2Batches';
import LatestZkEvmL2Batches from 'ui/home/latestBatches/LatestZkEvmL2Batches';
import LatestBlocks from 'ui/home/LatestBlocks';
import Stats from 'ui/home/Stats';
import Transactions from 'ui/home/Transactions';
import AdBanner from 'ui/shared/ad/AdBanner';

const rollupFeature = config.features.rollup;

const Home = () => {
  const isMobile = useIsMobile();

  const leftWidget = (() => {
    if (rollupFeature.isEnabled && !rollupFeature.homepage.showLatestBlocks) {
      switch (rollupFeature.type) {
        case 'zkEvm':
          return <LatestZkEvmL2Batches/>;
        case 'arbitrum':
          return <LatestArbitrumL2Batches/>;
      }
    }

    return <LatestBlocks/>;
  })();

  return (
    <HomeRpcDataContextProvider>
      <main>
        <HeroBanner/>
        <div className="flex mt-3 gap-x-2 gap-y-1 flex-col lg:flex-row">
          <Stats/>
          <ChainIndicators/>
        </div>
        { !isMobile && config.UI.homepage.highlights && <Highlights className="mt-3"/> }
        { isMobile && <AdBanner className="mt-6 mx-auto justify-center" format="mobile"/> }
        <div className="flex mt-8 gap-x-12 gap-y-6 flex-col lg:flex-row">
          { leftWidget }
          <div className="flex grow">
            <Transactions/>
          </div>
        </div>
      </main>
    </HomeRpcDataContextProvider>
  );
};

export default Home;
