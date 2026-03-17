import React from 'react';

import { cn } from 'lib/utils/cn';

export interface HeadingProps extends React.ComponentPropsWithoutRef<'h1'> {
  level?: '1' | '2' | '3';
  // Legacy Chakra style-prop shims
  mb?: number | string;
  size?: string;
}

const LEVEL_TAG = {
  '1': 'h1',
  '2': 'h2',
  '3': 'h3',
} as const;

// base (mobile) + lg (desktop) responsive text styles per level
//
// Level 1: heading.md -> heading.xl
//   base: 18px/24px font-500
//   lg:   32px/40px font-500 tracking=-0.5px
//
// Level 2: heading.sm -> heading.lg
//   base: 16px/24px font-500
//   lg:   24px/32px font-500
//
// Level 3: heading.xs -> heading.md
//   base: 14px/20px font-600
//   lg:   18px/24px font-500
const LEVEL_CLASSES = {
  '1': 'text-[18px] leading-[24px] font-medium lg:text-[32px] lg:leading-[40px] lg:tracking-[-0.5px]',
  '2': 'text-[16px] leading-[24px] font-medium lg:text-[24px] lg:leading-[32px]',
  '3': 'text-[14px] leading-[20px] font-semibold lg:text-[18px] lg:leading-[24px] lg:font-medium',
} as const;

const BASE_CLASSES = 'font-heading text-heading';

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ level, className, mb, size: _size, style: styleProp, ...rest }, ref) {
    const Tag = level ? LEVEL_TAG[level] : 'h2';
    const levelClasses = level ? LEVEL_CLASSES[level] : undefined;
    const shimStyle: React.CSSProperties = { ...styleProp };
    if (mb !== undefined) shimStyle.marginBottom = typeof mb === 'number' ? `${ mb * 4 }px` : mb;

    return (
      <Tag
        ref={ ref }
        className={ cn(BASE_CLASSES, levelClasses, className) }
        style={ Object.keys(shimStyle).length > 0 ? shimStyle : undefined }
        { ...rest }
      />
    );
  },
);
