import React from 'react';

import { cn } from 'lib/utils/cn';

export interface Props {
  gradientHeight: number;
  onScrollVisibilityChange?: (isVisible: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const ContainerWithScrollY = ({ gradientHeight, children, onScrollVisibilityChange, className }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ hasScroll, setHasScroll ] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const hasScroll = ref.current.scrollHeight >= ref.current.clientHeight + gradientHeight / 2;
    setHasScroll(hasScroll);
    onScrollVisibilityChange?.(hasScroll);
  }, [ gradientHeight, onScrollVisibilityChange ]);

  return (
    <div
      className={ cn('flex flex-col relative', hasScroll ? 'overflow-y-scroll pr-5' : 'overflow-y-auto', className) }
      ref={ ref }
      style={{
        paddingBottom: hasScroll ? `${ gradientHeight }px` : 0,
      }}
    >
      { children }
      { hasScroll && (
        <div
          className="absolute bottom-0 left-0 right-[20px]"
          style={{
            height: `${ gradientHeight }px`,
            background: `linear-gradient(to bottom, transparent, var(--color-bg-primary))`,
          }}
        />
      ) }
    </div>
  );
};

export default ContainerWithScrollY;
