import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import type { ImageProps } from '@luxfi/ui/image';
import { Image } from '@luxfi/ui/image';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import getChainTooltipText from './getChainTooltipText';

interface Props extends ImageProps {
  data: Omit<ExternalChain, 'explorer_url'> | undefined;
  isLoading?: boolean;
  noTooltip?: boolean;
}

const ChainIcon = ({ data, boxSize = 5, borderRadius = 'none', isLoading, noTooltip, ...rest }: Props) => {
  if (isLoading) {
    return <Skeleton className="size-5" borderRadius={ borderRadius === 'none' ? 'full' : String(borderRadius) } loading/>;
  }

  const placeholder = <IconSvg name="networks/icon-placeholder" className="text-[var(--color-icon-primary)]" style={{ width: typeof boxSize === 'number' ? `${ boxSize * 4 }px` : String(boxSize), height: typeof boxSize === 'number' ? `${ boxSize * 4 }px` : String(boxSize) }}/>;
  const content = (
    <Image
      src={ data?.logo }
      boxSize={ boxSize }
      borderRadius={ borderRadius }
      fallback={ placeholder }
      alt={ `${ data?.name || 'Unknown' } chain icon` }
      { ...rest }
    />
  );

  if (!noTooltip) {
    return (
      <Tooltip content={ getChainTooltipText(data) }>
        { content }
      </Tooltip>
    );
  }

  return content;
};

export default React.memo(ChainIcon);
