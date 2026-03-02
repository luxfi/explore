import React from 'react';

import config from 'configs/app';
import { Image } from '@luxfi/ui/image';

interface Props {
  className?: string;
}

const TestnetBadge = ({ className }: Props) => {
  if (!config.chain.isTestnet) {
    return null;
  }

  return <Image className={ className } src="/static/labels/testnet.svg" h="14px" w="37px" style={{ color: 'var(--color-red-400)' }}/>;
};

export default React.memo(TestnetBadge);
