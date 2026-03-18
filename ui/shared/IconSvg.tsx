import { type IconName } from 'public/icons/name';
import React from 'react';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';

export const href = config.app.spriteHash ? `/icons/sprite.${ config.app.spriteHash }.svg` : '/icons/sprite.svg';

export { IconName };

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  name: IconName;
  isLoading?: boolean;
}

const IconSvg = ({ name, isLoading = false, className, ref, ...props }: Props & { ref?: React.Ref<HTMLDivElement> }) => {
  if (isLoading) {
    return (
      <Skeleton loading display="inline-block" flexShrink={ 0 } className={ className } ref={ ref }>
        <svg className="w-full h-full">
          <use href={ `${ href }#${ name }` }/>
        </svg>
      </Skeleton>
    );
  }

  return (
    <div className={ `inline-block shrink-0 ${ className ?? '' }`.trim() } ref={ ref } { ...props }>
      <svg className="w-full h-full">
        <use href={ `${ href }#${ name }` }/>
      </svg>
    </div>
  );
};

IconSvg.displayName = 'IconSvg';

export default IconSvg;
