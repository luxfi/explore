import React from 'react';

import { cn } from 'lib/utils/cn';

type Orientation = 'horizontal' | 'vertical';
type Variant = 'solid' | 'dashed' | 'dotted';
type Size = 'xs' | 'sm' | 'md' | 'lg';

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  readonly orientation?: Orientation;
  readonly variant?: Variant;
  readonly size?: Size;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

const HORIZONTAL_SIZE_CLASSES: Record<Size, string> = {
  xs: 'border-t-[0.5px]',
  sm: 'border-t',
  md: 'border-t-2',
  lg: 'border-t-[3px]',
};

const VERTICAL_SIZE_CLASSES: Record<Size, string> = {
  xs: 'border-l-[0.5px]',
  sm: 'border-l',
  md: 'border-l-2',
  lg: 'border-l-[3px]',
};

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  function Separator(
    { orientation = 'horizontal', variant = 'solid', size = 'sm', className, ...rest },
    ref,
  ) {
    const isVertical = orientation === 'vertical';

    return (
      <hr
        ref={ ref }
        role="separator"
        aria-orientation={ orientation }
        className={ cn(
          'border-[var(--color-border-divider)]',
          'border-0',
          VARIANT_CLASSES[variant],
          isVertical ? VERTICAL_SIZE_CLASSES[size] : HORIZONTAL_SIZE_CLASSES[size],
          isVertical ? 'self-stretch h-auto w-0' : 'w-full',
          className,
        ) }
        { ...rest }
      />
    );
  },
);
