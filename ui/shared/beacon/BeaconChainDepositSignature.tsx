import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedTextTooltip } from 'toolkit/components/truncation/TruncatedTextTooltip';

import CopyToClipboard from '../CopyToClipboard';

const BeaconChainDepositSignature = ({ signature, isLoading }: { signature: string; isLoading: boolean }) => {
  return (
    <Skeleton loading={ isLoading } display="grid" gridTemplateColumns="1fr 24px" overflow="hidden">
      <TruncatedTextTooltip label={ signature }>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{ signature }</span>
      </TruncatedTextTooltip>
      <CopyToClipboard text={ signature }/>
    </Skeleton>
  );
};

export default React.memo(BeaconChainDepositSignature);
