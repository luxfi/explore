import React from 'react';

import config from 'configs/app';

import { CONTENT_MAX_WIDTH } from '../utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const TOP_BAR_HEIGHT = 36;
const HORIZONTAL_NAV_BAR_HEIGHT = config.UI.navigation.layout === 'horizontal' ? 49 : 0;

const MainArea = ({ children, className }: Props) => {
  return (
    <div className="flex items-stretch w-full mx-auto"       className={ className }
      maxW={ `${ CONTENT_MAX_WIDTH }px` }
      minH={{
        base: `calc(100vh - ${ TOP_BAR_HEIGHT }px)`,
        lg: `calc(100vh - ${ TOP_BAR_HEIGHT + HORIZONTAL_NAV_BAR_HEIGHT }px)`,
      }}
    >
      { children }
    </div>
  );
};

export default React.memo(MainArea);
