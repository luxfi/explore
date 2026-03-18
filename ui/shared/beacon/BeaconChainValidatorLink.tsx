
import React from 'react';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { TruncatedTextTooltip } from 'toolkit/components/truncation/TruncatedTextTooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

const feature = config.features.beaconChain;

const BeaconChainValidatorLink = ({ pubkey, isLoading }: { pubkey: string; isLoading?: boolean }) => {
  if (!feature.isEnabled) {
    return null;
  }

  let content;

  if (!feature.validatorUrlTemplate) {
    content = (
      <span className="inline-block text-ellipsis overflow-hidden whitespace-nowrap max-w-full">
        { pubkey }
      </span>
    );
  } else {
    content = (
      <Link
        href={ feature.validatorUrlTemplate.replace('{pk}', pubkey) }
        external
        loading={ isLoading }
        className="grid overflow-hidden"
        style={{ gridTemplateColumns: 'auto 20px' }}
      >
        <TruncatedTextTooltip label={ pubkey }>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{ pubkey }</span>
        </TruncatedTextTooltip>
      </Link>
    );
  }
  return (
    <Skeleton
      display="grid"
      overflow="hidden"
      gridTemplateColumns="auto 24px"
      alignItems="center"
      loading={ isLoading }
    >
      { content }
      <CopyToClipboard
        text={ pubkey }
        type="text"
        isLoading={ isLoading }
      />
    </Skeleton>
  );
};

export default React.memo(BeaconChainValidatorLink);
