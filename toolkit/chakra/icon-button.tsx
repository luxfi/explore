import { cva } from 'class-variance-authority';
import React from 'react';

import { cn } from 'lib/utils/cn';

import { Skeleton } from './skeleton';

/* -------------------------------------------------------------------------- */
/*  CVA variant definitions                                                   */
/* -------------------------------------------------------------------------- */

const iconButtonVariants = cva(
  // base
  [
    'inline-flex items-center justify-center',
    'p-0 min-w-auto shrink-0',
    'cursor-pointer border-0 bg-transparent',
    'disabled:opacity-[var(--opacity-control-disabled,0.4)] disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        plain: 'bg-transparent text-inherit border-none hover:bg-transparent',
        icon_secondary: [
          'bg-transparent text-icon-secondary border-none',
          'hover:text-hover',
          'data-[selected]:bg-selected-control-bg data-[selected]:text-selected-control-text',
          'data-[selected]:hover:text-hover',
          'data-[expanded]:text-hover',
        ],
        icon_background: [
          'bg-[var(--color-button-icon-background-bg)] text-icon-secondary border-none',
          'hover:text-hover',
          'data-[selected]:bg-selected-control-bg data-[selected]:text-selected-control-text',
          'data-[selected]:hover:text-hover',
          'data-[expanded]:text-hover',
        ],
        link: [
          'bg-transparent text-link-primary border-none font-normal px-0 h-auto',
          'hover:bg-transparent hover:text-link-primary-hover',
          'disabled:text-text-secondary',
        ],
        dropdown: [
          'border-2 border-solid bg-transparent',
          'text-[var(--color-button-dropdown-fg)] border-[var(--color-button-dropdown-border)]',
          'hover:bg-transparent hover:text-hover hover:border-hover',
          'data-[expanded]:bg-transparent data-[expanded]:text-hover data-[expanded]:border-hover',
          'data-[selected]:bg-selected-control-bg data-[selected]:text-selected-control-text data-[selected]:border-transparent',
          'data-[selected]:hover:text-hover',
        ],
        pagination: [
          'border-2 border-solid bg-transparent',
          'text-[var(--color-button-pagination-fg)] border-[var(--color-button-pagination-border)]',
          'hover:bg-transparent hover:text-hover hover:border-hover',
          'data-[selected]:bg-selected-control-bg data-[selected]:text-selected-control-text data-[selected]:border-transparent',
        ],
      },
      size: {
        '2xs': 'size-5 rounded-sm [&>svg]:size-5',
        '2xs_alt': 'size-5 rounded-sm [&>svg]:size-3',
        md: 'size-8 rounded-[var(--radius-base,8px)] [&>svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'plain',
    },
  },
);

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type Variant = 'plain' | 'icon_secondary' | 'icon_background' | 'link' | 'dropdown' | 'pagination';
type Size = '2xs' | '2xs_alt' | 'md';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: Variant;
  /** Icon-button size */
  size?: Size;
  /** Show a loading spinner (disables button) */
  loading?: boolean;
  /** Render a skeleton placeholder instead of the button */
  loadingSkeleton?: boolean;
  /** Maps to data-expanded for popover trigger styling */
  expanded?: boolean;
  /** Maps to data-selected for toggle styling */
  selected?: boolean;
  /** Maps to data-highlighted */
  highlighted?: boolean;
  /** Polymorphic element type (e.g. "div") */
  as?: React.ElementType;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    const {
      size,
      variant = 'plain',
      loading,
      loadingSkeleton = false,
      expanded,
      selected,
      highlighted,
      disabled,
      className,
      children,
      as: Comp = 'button',
      ...rest
    } = props;

    const button = (
      <Comp
        ref={ ref }
        type={ Comp === 'button' ? 'button' : undefined }
        disabled={ !loadingSkeleton && (loading || disabled) }
        className={ cn(iconButtonVariants({ variant, size }), className) }
        { ...(expanded ? { 'data-expanded': true } : {}) }
        { ...(selected ? { 'data-selected': true } : {}) }
        { ...(highlighted ? { 'data-highlighted': true } : {}) }
        { ...(loadingSkeleton ? { 'data-loading-skeleton': true } : {}) }
        { ...rest }
      >
        { loading ? (
          <span className="inline-block size-5 animate-spin rounded-full border-2 border-current border-b-transparent border-l-transparent"/>
        ) : children }
      </Comp>
    );

    if (loadingSkeleton) {
      return (
        <Skeleton loading={ loadingSkeleton } asChild ref={ ref as React.ForwardedRef<HTMLDivElement> }>
          { button }
        </Skeleton>
      );
    }

    return button;
  },
);
