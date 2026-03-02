import React from 'react';

import type { BridgeInfo } from '@luxfi/interchain-indexer-types';

import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';

interface Props {
  data: BridgeInfo | undefined;
  isLoading?: boolean;
  className?: string;
}

const CrossChainBridgeLink = ({ data, isLoading, className }: Props) => {

  if (!data) {
    return null;
  }

  if (data.ui_url) {
    return (
      <Link href={ data.ui_url } external loading={ isLoading } className={ className }>
        { data.name }
      </Link>
    );
  }

  return (
    <Skeleton loading={ isLoading } className={ className }>{ data.name }</Skeleton>
  );
};

export default React.memo(CrossChainBridgeLink);
