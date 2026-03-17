import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from 'lib/utils/cn';

import { TruncatedTextTooltip } from '../components/truncation/TruncatedTextTooltip';
import { Skeleton } from './skeleton';

type ColorPalette =
  'gray' | 'green' | 'red' | 'purple' | 'orange' | 'blue' | 'yellow' |
  'teal' | 'cyan' | 'pink' | 'purple_alt' | 'blue_alt' |
  'bright_gray' | 'bright_green' | 'bright_red' | 'bright_blue' |
  'bright_yellow' | 'bright_teal' | 'bright_cyan' | 'bright_orange' |
  'bright_purple' | 'bright_pink';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm gap-1 font-medium w-fit max-w-full whitespace-nowrap select-text',
  {
    variants: {
      variant: {
        subtle: '',
        solid: '',
      },
      size: {
        sm: 'text-xs p-1 h-[18px] min-h-[18px]',
        md: 'text-sm px-1 py-0.5 min-h-6',
        lg: 'text-sm px-2 py-1 min-h-7 font-semibold',
      },
    },
    defaultVariants: {
      variant: 'subtle',
      size: 'md',
    },
  },
);

const COLOR_PALETTE_CLASSES: Record<ColorPalette, string> = {
  gray: 'bg-badge-gray-bg text-badge-gray-fg',
  green: 'bg-badge-green-bg text-badge-green-fg',
  red: 'bg-badge-red-bg text-badge-red-fg',
  purple: 'bg-badge-purple-bg text-badge-purple-fg',
  orange: 'bg-badge-orange-bg text-badge-orange-fg',
  blue: 'bg-badge-blue-bg text-badge-blue-fg',
  yellow: 'bg-badge-yellow-bg text-badge-yellow-fg',
  teal: 'bg-badge-teal-bg text-badge-teal-fg',
  cyan: 'bg-badge-cyan-bg text-badge-cyan-fg',
  pink: 'bg-badge-pink-bg text-badge-pink-fg',
  purple_alt: 'bg-badge-purple-alt-bg text-badge-purple-alt-fg',
  blue_alt: 'bg-badge-blue-alt-bg text-badge-blue-alt-fg',
  bright_gray: 'bg-badge-bright-gray-bg text-badge-bright-gray-fg',
  bright_green: 'bg-badge-bright-green-bg text-badge-bright-green-fg',
  bright_red: 'bg-badge-bright-red-bg text-badge-bright-red-fg',
  bright_blue: 'bg-badge-bright-blue-bg text-badge-bright-blue-fg',
  bright_yellow: 'bg-badge-bright-yellow-bg text-badge-bright-yellow-fg',
  bright_teal: 'bg-badge-bright-teal-bg text-badge-bright-teal-fg',
  bright_cyan: 'bg-badge-bright-cyan-bg text-badge-bright-cyan-fg',
  bright_orange: 'bg-badge-bright-orange-bg text-badge-bright-orange-fg',
  bright_purple: 'bg-badge-bright-purple-bg text-badge-bright-purple-fg',
  bright_pink: 'bg-badge-bright-pink-bg text-badge-bright-pink-fg',
};

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
  VariantProps<typeof badgeVariants> {
  readonly loading?: boolean;
  readonly startElement?: React.ReactNode;
  readonly endElement?: React.ReactNode;
  readonly truncated?: boolean;
  readonly colorPalette?: ColorPalette;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  function Badge(props, ref) {
    const {
      loading,
      startElement,
      children,
      truncated = false,
      endElement,
      variant,
      size,
      colorPalette = 'gray',
      className,
      ...rest
    } = props;

    const child = children ? (
      <span className="overflow-hidden text-ellipsis">{ children }</span>
    ) : null;

    const childrenElement = truncated ? (
      <TruncatedTextTooltip label={ children }>
        { child }
      </TruncatedTextTooltip>
    ) : child;

    const badgeElement = (
      <span
        ref={ ref as React.Ref<HTMLSpanElement> }
        className={ cn(
          badgeVariants({ variant, size }),
          COLOR_PALETTE_CLASSES[colorPalette],
          className,
        ) }
        { ...rest }
      >
        { startElement }
        { childrenElement }
        { endElement }
      </span>
    );

    if (loading) {
      return (
        <Skeleton loading={ loading } asChild>
          { badgeElement }
        </Skeleton>
      );
    }

    return badgeElement;
  },
);
