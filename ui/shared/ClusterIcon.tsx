
import React from 'react';

import config from 'configs/app';
import { Image } from 'toolkit/chakra/image';
import type { ImageProps } from 'toolkit/chakra/image';
import IconSvg from 'ui/shared/IconSvg';

interface ClusterIconProps extends Omit<ImageProps, 'src' | 'alt'> {
  clusterName: string;
}

const nameServicesFeature = config.features.nameServices;

const ClusterIcon = ({
  clusterName,
  boxSize = 5,
  borderRadius = 'base',
  mr = 2,
  flexShrink = 0,
  ...imageProps
}: ClusterIconProps) => {
  const clustersFeature = nameServicesFeature.isEnabled && nameServicesFeature.clusters.isEnabled ? nameServicesFeature.clusters : undefined;

  const fallbackElement = (
    <span className="inline-flex items-center justify-center bg-[var(--color-clusters)] rounded-base mr-2 shrink-0" style={{ width: typeof boxSize === 'number' ? `${ boxSize * 4 }px` : boxSize, height: typeof boxSize === 'number' ? `${ boxSize * 4 }px` : boxSize }}>
      <IconSvg
        name="clusters"
        boxSize={ 3 }
        color="white"
      />
    </span>
  );

  if (!clustersFeature) {
    return fallbackElement;
  }

  return (
    <Image
      boxSize={ boxSize }
      borderRadius={ borderRadius }
      mr={ mr }
      flexShrink={ flexShrink }

      src={ `${ clustersFeature.cdnUrl }/profile-image/${ clusterName }` }
      alt={ `${ clusterName } profile` }
      fallback={ fallbackElement }
      { ...imageProps }
    />
  );
};

export default React.memo(ClusterIcon);
