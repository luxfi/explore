import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import useInitialList from 'lib/hooks/useInitialList';
import { publicClient } from 'lib/web3/client';
import { BLOCK } from 'stubs/block';
import { Link } from 'toolkit/chakra/link';

import LatestBlocksItem from '../LatestBlocksItem';
import LatestBlocksFallback from './LatestBlocksFallback';
import { useHomeRpcDataContext } from './rpcDataContext';

interface Props {
  maxNum: number;
}

const LatestBlocksDegraded = ({ maxNum }: Props) => {

  const { blocks, isError, isLoading, enable } = useHomeRpcDataContext();

  React.useEffect(() => {
    enable(true, 'latest-blocks');
    return () => {
      enable(false, 'latest-blocks');
    };
  }, [ enable ]);

  const initialList = useInitialList({
    data: [] as Array<Block>,
    idFn: (block) => block.height,
    enabled: !isError,
  });

  if (isError || !publicClient) {
    return <LatestBlocksFallback/>;
  }

  const items = isLoading ? Array(maxNum).fill(BLOCK) : blocks.slice(0, maxNum);

  if (items.length === 0) {
    return <Box textStyle="sm">No latest blocks found.</Box>;
  }

  return (
    <>
      <Flex gap={ 2 } mb={ 3 } overflowX="auto" alignItems="stretch" pb={ 1 }>
        { items.map(((block, index) => (
          <LatestBlocksItem
            key={ block.height + (isLoading ? String(index) : '') }
            block={ block }
            isLoading={ isLoading }
            animation={ initialList.getAnimationProp(block) }
          />
        ))) }
      </Flex>
      <Flex justifyContent="center">
        <Link className="text-sm" href={ route({ pathname: '/blocks' }) } loading={ isLoading }>View all blocks</Link>
      </Flex>
    </>
  );
};

export default React.memo(LatestBlocksDegraded);
