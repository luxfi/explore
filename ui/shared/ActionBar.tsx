import React from 'react';

import { cn } from 'lib/utils/cn';
import { useIsSticky } from 'toolkit/hooks/useIsSticky';

type Props = {
  children: React.ReactNode;
  className?: string;
  showShadow?: boolean;
};

export const ACTION_BAR_HEIGHT_DESKTOP = 24 + 32 + 12;
export const ACTION_BAR_HEIGHT_MOBILE = 24 + 32 + 24;

const ActionBar = ({ children, className, showShadow }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isSticky = useIsSticky(ref, 5);

  if (!React.Children.toArray(children).filter(Boolean).length) {
    return null;
  }

  return (
    <div
      className={ cn(
        'flex bg-[var(--color-bg-primary)] pt-6 -mt-6 pb-6 lg:pb-3 -mx-3 lg:mx-0 px-3 lg:px-0',
        'justify-between w-screen lg:w-auto sticky top-0 transition-all z-[var(--z-index-sticky2)] lg:z-[var(--z-index-docked)]',
        isSticky ? 'shadow-md' : 'shadow-none',
        isSticky && showShadow ? 'lg:shadow-[var(--shadow-action-bar)]' : 'lg:shadow-none',
        className,
      ) }
      ref={ ref }
    >
      { children }
    </div>
  );
};

export default ActionBar;
