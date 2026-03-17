import * as React from 'react';

import { cn } from 'lib/utils/cn';

export interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: 'plain';
  readonly size?: 'md';
}

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  const { variant: _variant, size: _size, className, children, ...rest } = props;

  return (
    <button
      type="button"
      aria-label="Close"
      ref={ ref }
      className={ cn(
        'inline-flex items-center justify-center',
        'size-5 min-w-0 shrink-0 p-0',
        'rounded-sm border-0 overflow-hidden',
        'bg-transparent text-[var(--closeButton-fg,currentColor)]',
        'hover:bg-transparent hover:text-[var(--hover-color,currentColor)]',
        'disabled:opacity-40',
        'cursor-pointer',
        className,
      ) }
      { ...rest }
    >
      { children ?? (
        <svg
          className="size-5"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9.44 8.035a.791.791 0 0 0 1.12 0l3.802-3.803a.791.791 0 0 1 1.119 0l.287.287a.79.79 0 0 1 0 1.119L11.965 9.44a.79.79 0 0 0 0 1.118l3.803 3.803a.791.791 0 0 1 0 1.119l-.287.287a.791.791 0 0 1-1.119 0l-3.803-3.803a.79.79 0 0 0-1.118 0l-3.803 3.803a.79.79 0 0 1-1.119 0l-.287-.287a.791.791 0 0 1 0-1.119l3.803-3.803a.791.791 0 0 0 0-1.118L4.232 5.638a.791.791 0 0 1 0-1.119l.287-.287a.791.791 0 0 1 1.119 0L9.44 8.035Z"
            fill="currentColor"
          />
        </svg>
      ) }
    </button>
  );
});
