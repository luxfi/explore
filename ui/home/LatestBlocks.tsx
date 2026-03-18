import { useQueryClient } from '@tanstack/react-query';
import { upperFirst } from 'es-toolkit';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import useInitialList from 'lib/hooks/useInitialList';
import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkUtilizationParams from 'lib/networks/getNetworkUtilizationParams';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { nbsp } from 'toolkit/utils/htmlEntities';
import FallbackRpcIcon from 'ui/shared/fallbacks/FallbackRpcIcon';

import LatestBlocksDegraded from './fallbacks/LatestBlocksDegraded';
import { useHomeRpcDataContext } from './fallbacks/rpcDataContext';
import LatestBlocksItem from './LatestBlocksItem';

const LatestBlocks = () => {
  const isMobile = useIsMobile();
  let blocksMaxCount: number;
  if (config.features.rollup.isEnabled || config.UI.views.block.hiddenFields?.total_reward) {
    blocksMaxCount = isMobile ? 4 : 8;
  } else {
    blocksMaxCount = isMobile ? 4 : 6;
  }
  const { data, isPlaceholderData, isError } = useApiQuery('general:homepage_blocks', {
    queryOptions: {
      placeholderData: Array(blocksMaxCount).fill(BLOCK),
    },
  });
  const initialList = useInitialList({
    data: data ?? [],
    idFn: (block) => block.height,
    enabled: !isPlaceholderData,
  });

  const queryClient = useQueryClient();
  const statsQueryResult = useApiQuery('general:stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const rpcDataContext = useHomeRpcDataContext();
  const isRpcData = rpcDataContext.isEnabled && !rpcDataContext.isLoading && !rpcDataContext.isError && rpcDataContext.subscriptions.includes('latest-blocks');

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('general:homepage_blocks'), (prevData: Array<Block> | undefined) => {

      const newData = prevData ? [ ...prevData ] : [];

      if (newData.some((block => block.height === payload.block.height))) {
        return newData;
      }

      return [ payload.block, ...newData ].sort((b1, b2) => b2.height - b1.height).slice(0, blocksMaxCount);
    });
  }, [ queryClient, blocksMaxCount ]);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    isDisabled: isPlaceholderData || isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  const content = (() => {
    if (isError) {
      return <LatestBlocksDegraded maxNum={ blocksMaxCount }/>;
    }
    if (data && data.length > 0) {
      const dataToShow = data.slice(0, blocksMaxCount);

      return (
        <>
          <div className="flex gap-3 overflow-x-auto items-stretch pb-2 -mb-2">
            { dataToShow.map(((block, index) => (
              <LatestBlocksItem
                key={ block.height + (isPlaceholderData ? String(index) : '') }
                block={ block }
                isLoading={ isPlaceholderData }
                animation={ initialList.getAnimationProp(block) }
              />
            ))) }
          </div>
          <div className="flex justify-center mt-4">
            <Link className="text-sm" href={ route({ pathname: '/blocks' }) } loading={ isPlaceholderData }>View all blocks</Link>
          </div>
        </>
      );
    }
    return <div className="text-sm text-[var(--color-text-secondary)]">No latest blocks found.</div>;
  })();

  const networkUtilization = getNetworkUtilizationParams(statsQueryResult.data?.network_utilization_percentage ?? 0);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Heading level="3">Latest blocks</Heading>
        { isRpcData && <FallbackRpcIcon/> }
        { statsQueryResult.data?.network_utilization_percentage !== undefined && (
          <Skeleton loading={ statsQueryResult.isPlaceholderData } className="inline-block text-sm ml-auto">
            <span className="text-[var(--color-text-secondary)]">
              Network utilization:{ nbsp }
            </span>
            <Tooltip content={ `${ upperFirst(networkUtilization.load) } load` }>
              <span className="font-bold" style={{ color: networkUtilization.color }}>
                { statsQueryResult.data?.network_utilization_percentage.toFixed(2) }%
              </span>
            </Tooltip>
          </Skeleton>
        ) }
      </div>
      { statsQueryResult.data?.celo && (
        <div className="whitespace-pre-wrap text-sm mb-3 text-[var(--color-text-secondary)]">
          <span>Current epoch: </span>
          <span className="font-bold text-[var(--color-text-primary)]">#{ statsQueryResult.data.celo.epoch_number }</span>
        </div>
      ) }
      { content }
    </div>
  );
};

export default LatestBlocks;
