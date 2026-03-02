import React from 'react';

import config from 'configs/app';
import { Tag, type TagProps } from '@luxfi/ui/tag';
import { Tooltip } from '@luxfi/ui/tooltip';

interface Props extends TagProps {
  chainConfig?: typeof config;
}

const NativeTokenTag = ({ chainConfig: chainConfigProp, ...rest }: Props) => {
  const chainConfig = chainConfigProp || config;
  if (!chainConfig.UI.views.address.nativeTokenAddress) {
    return null;
  }

  return (
    <Tooltip
      content={ `This ERC-20 token represents the native ${ chainConfig.chain.currency.symbol } balance for this address and isn’t counted twice` }
    >
      <Tag { ...rest }>Native token</Tag>
    </Tooltip>
  );
};

export default React.memo(NativeTokenTag);
