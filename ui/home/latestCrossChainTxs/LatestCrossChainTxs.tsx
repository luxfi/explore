import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import { INTERCHAIN_MESSAGE } from 'stubs/interchainIndexer';
import { generateListStub } from 'stubs/utils';
import { Link } from 'toolkit/next/link';
import { TableBody, TableRoot } from '@luxfi/ui/table';
import TransactionsCrossChainListItem from 'ui/crossChain/txs/TransactionsCrossChainListItem';

import LatestCrossChainTxsItemDesktop from './LatestCrossChainTxsItemDesktop';

const LatestCrossChainTxs = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 5;
  const { data, isPlaceholderData, isError } = useApiQuery('interchainIndexer:messages', {
    queryOptions: {
      placeholderData: generateListStub<'interchainIndexer:messages'>(
        INTERCHAIN_MESSAGE,
        txsCount,
        {
          next_page_params: undefined,
        },
      ),
    },
  });

  if (isError || !data) {
    return <span className="mt-4">No data. Please reload the page.</span>;
  }

  return (
    <>
      <div className="mb-3 lg:hidden text-sm">
        { data.items.slice(0, txsCount).map(((tx, index) => (
          <TransactionsCrossChainListItem
            key={ tx.message_id + (isPlaceholderData ? index : '') }
            data={ tx }
            isLoading={ isPlaceholderData }
          />
        ))) }
      </div>
      <div className="mb-3 hidden lg:block text-sm">
        <TableRoot minWidth="750px">
          <TableBody>
            { data.items.slice(0, txsCount).map(((tx, index) => (
              <LatestCrossChainTxsItemDesktop
                key={ tx.message_id + (isPlaceholderData ? index : '') }
                data={ tx }
                isLoading={ isPlaceholderData }
              />
            ))) }
          </TableBody>
        </TableRoot>
      </div>
      <div className="flex justify-center">
        <Link className="text-sm" href={ route({ pathname: '/txs', query: { tab: 'txs_cross_chain' } }) }>View all transactions</Link>
      </div>
    </>
  );
};

export default React.memo(LatestCrossChainTxs);
