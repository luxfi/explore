import { cva } from 'class-variance-authority';
import React from 'react';

import { cn } from 'lib/utils/cn';

const inputVariants = cva(
  [
    'w-full appearance-none outline-none transition-colors',
    'bg-[var(--color-input-bg)] text-[var(--color-input-fg)] border-[var(--color-input-border)]',
    'placeholder:text-[var(--color-input-placeholder,theme(colors.gray.400))]',
    'hover:border-[var(--color-input-border-hover,theme(colors.gray.400))]',
    'focus:border-[var(--color-input-border-focus,theme(colors.blue.500))]',
    'focus:placeholder:text-[var(--color-input-placeholder-focus,theme(colors.gray.300))]',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    'read-only:opacity-70',
    'data-[invalid]:border-[var(--color-input-border-invalid,theme(colors.red.500))]',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'h-6 px-2 text-xs rounded',
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-base rounded-md',
        lg: 'h-12 px-4 text-lg rounded-lg',
        '2xl': 'h-14 px-4 text-xl rounded-lg',
      },
      variant: {
        outline: 'border border-solid',
        filled: 'border-0 bg-[var(--color-input-filled-bg,theme(colors.gray.100))]',
        unstyled: 'border-0 bg-transparent p-0 h-auto',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'outline',
    },
  },
);

type InputSize = 'xs' | 'sm' | 'md' | 'lg' | '2xl';
type InputVariant = 'outline' | 'filled' | 'unstyled';

export interface InputProps extends Omit<React.ComponentPropsWithRef<'input'>, 'size'> {
  readonly size?: InputSize;
  readonly variant?: InputVariant;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size, variant, className, ...rest }, ref) => {
    return (
      <input
        ref={ ref }
        className={ cn(inputVariants({ size, variant }), className) }
        { ...rest }
      />
    );
  },
);

Input.displayName = 'FieldInput';
