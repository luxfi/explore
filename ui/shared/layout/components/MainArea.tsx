import React from 'react';

import config from 'configs/app';
import { cn } from 'lib/utils/cn';

import { CONTENT_MAX_WIDTH } from '../utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const TOP_BAR_HEIGHT = 36;
const HORIZONTAL_NAV_BAR_HEIGHT = config.UI.navigation.layout === 'horizontal' ? 49 : 0;

const MainArea = ({ children, className }: Props) => {
  return (
    <div
      className={ cn('flex items-stretch w-full mx-auto', className) }
      style={{
        maxWidth: `${ CONTENT_MAX_WIDTH }px`,
        minHeight: `calc(100vh - ${ TOP_BAR_HEIGHT + HORIZONTAL_NAV_BAR_HEIGHT }px)`,
      }}
    >
      { children }
    </div>
  );
};

export default React.memo(MainArea);
