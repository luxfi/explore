import { clamp } from 'es-toolkit';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { publicClient } from 'lib/web3/client';
import { TX } from 'stubs/tx';
import { Link } from 'toolkit/chakra/link';

import LatestTxsItem from '../LatestTxsItem';
import LatestTxsItemMobile from '../LatestTxsItemMobile';
import LatestTxsDegradedNewItems from './LatestTxsDegradedNewItems';
import LatestTxsFallback from './LatestTxsFallback';
import { useHomeRpcDataContext } from './rpcDataContext';

const zetachainFeature = config.features.zetachain;

interface Props {
  maxNum: number;
}

const LatestTxsDegraded = ({ maxNum }: Props) => {
  const { txs, totalTxs, isError, isLoading, enable } = useHomeRpcDataContext();

  React.useEffect(() => {
    enable(true, 'latest-txs');
    return () => {
      enable(false, 'latest-txs');
    };
  }, [ enable ]);

  if (isError || !publicClient) {
    return <LatestTxsFallback/>;
  }

  const items = isLoading ? Array(maxNum).fill(TX) : txs.slice(0, maxNum);

  if (items.length === 0) {
    return <div className="text-sm">No latest transactions found.</div>;
  }

  const txsUrl = route({ pathname: `/txs`, query: zetachainFeature.isEnabled ? { tab: 'evm' } : undefined });
  const overflow = clamp(totalTxs - maxNum, 0, Infinity);

  return (
    <>
      <LatestTxsDegradedNewItems overflow={ overflow } url={ txsUrl } isLoading={ isLoading }/>
      <div className="mb-3 block lg:hidden text-sm">
        { items.map(((tx, index) => (
          <LatestTxsItemMobile
            key={ tx.hash + (isLoading ? index : '') }
            tx={ tx }
            isLoading={ isLoading }
          />
        ))) }
      </div>
      <AddressHighlightProvider>
        <div className="mb-3 hidden lg:block text-sm">
          { items.map(((tx, index) => (
            <LatestTxsItem
              key={ tx.hash + (isLoading ? index : '') }
              tx={ tx }
              isLoading={ isLoading }
            />
          ))) }
        </div>
      </AddressHighlightProvider>
      <div className="flex justify-center">
        <Link className="text-sm" loading={ isLoading } href={ txsUrl }>View all transactions</Link>
      </div>
    </>
  );
};

export default React.memo(LatestTxsDegraded);
