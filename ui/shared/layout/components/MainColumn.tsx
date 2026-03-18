import React from 'react';

import config from 'configs/app';
import { cn } from 'lib/utils/cn';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const isHorizontal = config.UI.navigation.layout === 'horizontal';

const MainColumn = ({ children, className }: Props) => {
  return (
    <div
      className={ cn(
        'flex flex-col grow pt-[12px] lg:pt-6 pb-8',
        'w-full',
        isHorizontal ? 'lg:w-full' : 'lg:w-auto',
        isHorizontal ? 'px-3 lg:px-6' : 'px-3 lg:px-12',
        '2xl:pr-6',
        className,
      ) }
    >
      { children }
    </div>
  );
};

export default React.memo(MainColumn);
