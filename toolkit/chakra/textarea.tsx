import { cva } from 'class-variance-authority';
import React from 'react';

import { cn } from 'lib/utils/cn';

const textareaVariants = cva(
  [
    'w-full appearance-none outline-none transition-colors resize-y',
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
        xs: 'px-2 py-1 text-xs rounded',
        sm: 'px-3 py-2 text-sm rounded-md',
        md: 'px-4 py-2 text-base rounded-md',
        lg: 'px-4 py-3 text-lg rounded-lg',
        '2xl': 'px-4 py-3 text-xl rounded-lg',
      },
      variant: {
        outline: 'border border-solid',
        filled: 'border-0 bg-[var(--color-input-filled-bg,theme(colors.gray.100))]',
        unstyled: 'border-0 bg-transparent p-0',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'outline',
    },
  },
);

type TextareaSize = 'xs' | 'sm' | 'md' | 'lg' | '2xl';
type TextareaVariant = 'outline' | 'filled' | 'unstyled';

export interface TextareaProps extends Omit<React.ComponentPropsWithRef<'textarea'>, 'size'> {
  readonly size?: TextareaSize;
  readonly variant?: TextareaVariant;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size, variant, className, ...rest }, ref) => {
    return (
      <textarea
        ref={ ref }
        className={ cn(textareaVariants({ size, variant }), className) }
        { ...rest }
      />
    );
  },
);

Textarea.displayName = 'Textarea';
