import type { IconName } from 'public/icons/name';
import React from 'react';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';

export const href = config.app.spriteHash ? `/icons/sprite.${ config.app.spriteHash }.svg` : '/icons/sprite.svg';

export { IconName };

export interface Props extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  isLoading?: boolean;
}

const IconSvg = React.forwardRef(
  function IconSvg({ name, isLoading = false, ...props }: Props, ref: React.ForwardedRef<SVGSVGElement>) {
    return (
      <Skeleton loading={ isLoading } display="inline-block" flexShrink={ 0 } asChild>
        <svg
          ref={ ref }
          width="100%"
          height="100%"
          { ...props }
        >
          <use href={ `${ href }#${ name }` }/>
        </svg>
      </Skeleton>
    );
  },
);

IconSvg.displayName = 'IconSvg';

export default IconSvg;
