import { Skeleton } from '@luxfi/ui/skeleton';
import { type IconName } from 'public/icons/name';
import React from 'react';

import config from 'configs/app';

export const href = config.app.spriteHash ? `/icons/sprite.${ config.app.spriteHash }.svg` : '/icons/sprite.svg';

export { IconName };

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  name: IconName;
  isLoading?: boolean;
}

const DEFAULT_SIZE = 'w-5 h-5';

const hasSize = (cls?: string): boolean => {
  if (!cls) return false;
  return /(?:^|\s)(?:w-|h-|size-)/.test(cls);
};

const IconSvg = ({ name, isLoading = false, className, ref, ...props }: Props & { ref?: React.Ref<HTMLDivElement> }) => {
  const resolvedClass = hasSize(className) ? className! : `${ DEFAULT_SIZE } ${ className ?? '' }`.trim();

  if (isLoading) {
    return (
      <Skeleton loading display="inline-block" flexShrink={ 0 } className={ resolvedClass } ref={ ref }>
        <svg className="w-full h-full" viewBox="0 0 20 20" fill="currentColor">
          <use href={ `${ href }#${ name }` }/>
        </svg>
      </Skeleton>
    );
  }

  return (
    <div className={ `inline-block shrink-0 ${ resolvedClass }`.trim() } ref={ ref } { ...props }>
      <svg className="w-full h-full" viewBox="0 0 20 20" fill="currentColor">
        <use href={ `${ href }#${ name }` }/>
      </svg>
    </div>
  );
};

IconSvg.displayName = 'IconSvg';

export default IconSvg;
