import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

import { Skeleton } from './skeleton';

// ---------------------------------------------------------------------------
// CVA variant definition
// ---------------------------------------------------------------------------
// All colors reference CSS custom properties from styles/tokens.css so they
// automatically adapt to light/dark mode via the .dark class.
//
// Sizes use Tailwind spacing utilities that match the old Chakra recipe values:
//   2xs → h-5 (20px)  xs → h-6 (24px)  sm → h-8 (32px)  md → h-10 (40px)
// ---------------------------------------------------------------------------

const buttonVariants = cva(
  // base styles (shared across all variants)
  [
    'inline-flex items-center justify-center',
    'gap-0 font-semibold overflow-hidden rounded-md',
    'cursor-pointer select-none whitespace-nowrap',
    'transition-colors duration-150',
    'disabled:opacity-[0.2] disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        // --- Solid ---
        solid: [
          'bg-[var(--color-button-solid-bg)] text-[var(--color-button-solid-text)]',
          'hover:bg-[var(--color-hover)]',
          'data-[expanded]:bg-[var(--color-hover)]',
        ],
        // --- Solid Danger ---
        solid_danger: [
          'bg-red-600 text-[var(--color-button-solid-text)]',
          'hover:bg-red-500',
          'data-[expanded]:bg-red-500',
        ],
        // --- Outline ---
        outline: [
          'border-2 border-solid bg-transparent',
          'text-[var(--color-button-outline-fg)] border-[var(--color-button-outline-fg)]',
          'hover:bg-transparent hover:text-[var(--color-hover)] hover:border-[var(--color-hover)]',
        ],
        // --- Outline Danger ---
        outline_danger: [
          'border-2 border-solid bg-transparent',
          'text-red-600 border-red-600',
          'hover:bg-transparent hover:text-red-500 hover:border-red-500',
        ],
        // --- Dropdown ---
        dropdown: [
          'border-2 border-solid bg-transparent',
          'text-[var(--color-button-dropdown-fg)] border-[var(--color-button-dropdown-border)]',
          'hover:bg-transparent hover:text-[var(--color-hover)] hover:border-[var(--color-hover)]',
          'data-[expanded]:bg-transparent data-[expanded]:text-[var(--color-hover)] data-[expanded]:border-[var(--color-hover)]',
          'data-[selected]:bg-[var(--color-selected-control-bg)] data-[selected]:text-[var(--color-selected-control-text)] data-[selected]:border-transparent',
          'data-[selected]:hover:bg-[var(--color-selected-control-bg)]',
          'data-[selected]:hover:text-[var(--color-hover)] data-[selected]:hover:border-transparent',
          'data-[selected]:data-[expanded]:text-[var(--color-hover)]',
        ],
        // --- Header ---
        header: [
          'bg-transparent border-2 border-solid',
          'text-[var(--color-button-header-fg)] border-[var(--color-button-header-border)]',
          'hover:bg-transparent hover:text-[var(--color-hover)] hover:border-[var(--color-hover)]',
          // selected
          'data-[selected]:bg-[var(--color-button-header-bg-selected)]',
          'data-[selected]:text-[var(--color-button-header-fg-selected)] data-[selected]:border-transparent data-[selected]:border-0',
          'data-[selected]:hover:bg-[var(--color-button-header-bg-selected)] data-[selected]:hover:text-[var(--color-hover)]',
          'data-[selected]:data-[expanded]:text-[var(--color-hover)]',
          // selected + highlighted
          'data-[selected]:data-[highlighted]:bg-[var(--color-button-header-bg-highlighted)]',
          'data-[selected]:data-[highlighted]:text-[var(--color-button-header-fg-highlighted)]',
          'data-[selected]:data-[highlighted]:border-transparent data-[selected]:data-[highlighted]:border-0',
          'data-[selected]:data-[highlighted]:hover:bg-[var(--color-button-header-bg-highlighted)]',
          'data-[selected]:data-[highlighted]:hover:text-[var(--color-hover)]',
          'data-[selected]:data-[highlighted]:data-[expanded]:text-[var(--color-hover)]',
        ],
        // --- Hero ---
        hero: [
          'bg-[var(--color-button-hero-bg)] text-[var(--color-button-hero-fg)]',
          'hover:bg-[var(--color-button-hero-bg-hover)] hover:text-[var(--color-button-hero-fg-hover)]',
          'data-[selected]:bg-[var(--color-button-hero-bg-selected)] data-[selected]:text-[var(--color-button-hero-fg-selected)]',
          'data-[selected]:hover:bg-[var(--color-button-hero-bg-selected)] data-[selected]:hover:text-[var(--color-hover)]',
          'data-[selected]:data-[expanded]:text-[var(--color-hover)]',
        ],
        // --- Segmented ---
        segmented: [
          'bg-transparent border-2 border-solid rounded-none',
          'text-[var(--color-button-segmented-fg)] border-[var(--color-selected-control-bg)]',
          'hover:text-[var(--color-hover)]',
          // selected
          'data-[selected]:bg-[var(--color-selected-control-bg)] data-[selected]:text-[var(--color-selected-control-text)]',
          'data-[selected]:hover:bg-[var(--color-selected-control-bg)] data-[selected]:hover:text-[var(--color-selected-control-text)]',
          // border collapse: hide right border except when selected; first/last get rounded
          '[&:not(:last-child)]:border-r-0 data-[selected]:[&:not(:last-child)]:border-r-2',
          'data-[selected]+*:border-l-0',
          'first:rounded-l-md last:rounded-r-md',
        ],
        // --- Plain ---
        plain: [
          'bg-transparent text-inherit border-none',
          'hover:bg-transparent',
        ],
        // --- Subtle ---
        subtle: [
          'bg-[var(--color-button-subtle-bg)] text-[var(--color-button-subtle-fg)]',
          'hover:bg-[var(--color-button-subtle-bg)] hover:text-[var(--color-hover)]',
          'disabled:bg-[var(--color-button-subtle-bg)] disabled:text-[var(--color-button-subtle-fg)]',
        ],
        // --- Link ---
        link: [
          'bg-transparent text-[var(--color-link-primary)] border-none font-normal',
          'px-0 h-auto',
          'hover:bg-transparent hover:text-[var(--color-link-primary-hover)]',
          'disabled:text-[var(--color-text-secondary)]',
        ],
        // --- Icon Secondary ---
        icon_secondary: [
          'bg-transparent text-[var(--color-icon-secondary)] border-none',
          'hover:text-[var(--color-hover)]',
          'data-[selected]:bg-[var(--color-selected-control-bg)] data-[selected]:text-[var(--color-selected-control-text)]',
          'data-[selected]:hover:bg-[var(--color-selected-control-bg)] data-[selected]:hover:text-[var(--color-hover)]',
          'data-[selected]:data-[expanded]:text-[var(--color-hover)]',
          'data-[expanded]:text-[var(--color-hover)]',
        ],
        // --- Icon Background ---
        icon_background: [
          'bg-[var(--color-button-icon-background-bg)] text-[var(--color-icon-secondary)] border-none',
          'hover:text-[var(--color-hover)]',
          'data-[selected]:bg-[var(--color-selected-control-bg)] data-[selected]:text-[var(--color-selected-control-text)]',
          'data-[selected]:hover:bg-[var(--color-selected-control-bg)] data-[selected]:hover:text-[var(--color-hover)]',
          'data-[selected]:data-[expanded]:text-[var(--color-hover)]',
          'data-[expanded]:text-[var(--color-hover)]',
        ],
        // --- Pagination ---
        pagination: [
          'border-2 border-solid bg-transparent',
          'text-[var(--color-button-pagination-fg)] border-[var(--color-button-pagination-border)]',
          'hover:bg-transparent hover:text-[var(--color-hover)] hover:border-[var(--color-hover)]',
          'data-[selected]:bg-[var(--color-selected-control-bg)] data-[selected]:text-[var(--color-selected-control-text)] data-[selected]:border-transparent',
          'data-[selected]:hover:bg-[var(--color-selected-control-bg)]',
          'data-[selected]:hover:text-[var(--color-selected-control-text)] data-[selected]:hover:border-transparent',
        ],
      },

      size: {
        '2xs': 'px-2 h-5 min-w-5 text-xs rounded-sm gap-1',
        xs: 'px-2 h-6 min-w-6 text-sm rounded-sm gap-1',
        sm: 'px-3 h-8 min-w-8 text-sm rounded-md gap-1',
        md: 'px-3 h-10 min-w-10 text-base rounded-md gap-2',
      },
    },

    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
);

// ---------------------------------------------------------------------------
// Spinner (replaces Chakra's built-in loading spinner)
// ---------------------------------------------------------------------------

interface SpinnerProps {
  readonly className?: string;
}

function Spinner({ className }: SpinnerProps): React.ReactElement {
  return (
    <span
      className={ cn(
        'inline-block h-4 w-4 animate-spin rounded-full',
        'border-2 border-current border-b-transparent border-l-transparent',
        className,
      ) }
      role="status"
      aria-label="Loading"
    />
  );
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
  readonly loading?: boolean;
  readonly loadingText?: React.ReactNode;
  readonly loadingSkeleton?: boolean;
  readonly expanded?: boolean;
  readonly selected?: boolean;
  readonly highlighted?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      loadingSkeleton = false,
      expanded,
      selected,
      highlighted,
      disabled,
      children,
      ...rest
    } = props;

    const Comp = asChild ? Slot : 'button';

    // Build data-* attributes for state-driven variant styles
    const dataAttrs: Record<string, true> = {};
    if (expanded) dataAttrs['data-expanded'] = true;
    if (selected) dataAttrs['data-selected'] = true;
    if (highlighted) dataAttrs['data-highlighted'] = true;
    if (loadingSkeleton) dataAttrs['data-loading-skeleton'] = true;

    const isDisabled = !loadingSkeleton && (loading || disabled);

    const inner = loading ? (
      <>
        <Spinner/>
        { loadingText != null && <span className="ml-2">{ loadingText }</span> }
      </>
    ) : (
      children
    );

    const button = (
      <Comp
        ref={ ref }
        className={ cn(buttonVariants({ variant, size }), className) }
        disabled={ isDisabled || undefined }
        { ...dataAttrs }
        { ...rest }
      >
        { inner }
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

// ---------------------------------------------------------------------------
// ButtonGroup
// ---------------------------------------------------------------------------

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(props, ref) {
    const { className, ...rest } = props;

    return (
      <div
        ref={ ref }
        className={ cn('inline-flex', className) }
        role="group"
        { ...rest }
      />
    );
  },
);

// ---------------------------------------------------------------------------
// ButtonGroupRadio
// ---------------------------------------------------------------------------

export interface ButtonGroupRadioProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  children: Array<React.ReactElement<ButtonProps>>;
  onChange?: (value: string) => void;
  defaultValue?: string;
  loading?: boolean;
  equalWidth?: boolean;
  variant?: ButtonProps['variant'];
}

export const ButtonGroupRadio = React.forwardRef<HTMLDivElement, ButtonGroupRadioProps>(
  function ButtonGroupRadio(props, ref) {
    const {
      children,
      onChange,
      variant = 'segmented',
      defaultValue,
      loading = false,
      equalWidth = false,
      className,
      ...rest
    } = props;

    const firstChildValue = React.useMemo(() => {
      const firstChild = Array.isArray(children) ? children[0] : undefined;
      return typeof firstChild?.props.value === 'string' ? firstChild.props.value : undefined;
    }, [ children ]);

    const [ value, setValue ] = React.useState<string | undefined>(defaultValue ?? firstChildValue);

    const handleItemClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      const v = event.currentTarget.value;
      setValue(v);
      onChange?.(v);
    }, [ onChange ]);

    const clonedChildren = React.Children.map(children, (child: React.ReactElement<ButtonProps>) => {
      return React.cloneElement(child, {
        onClick: handleItemClick,
        selected: value === child.props.value,
        variant,
      });
    });

    const childrenLength = React.Children.count(children);

    return (
      <Skeleton loading={ loading }>
        <div
          ref={ ref }
          className={ cn(
            'inline-flex gap-0',
            equalWidth && 'grid',
            className,
          ) }
          style={ equalWidth ? { gridTemplateColumns: `repeat(${ childrenLength }, 1fr)` } : undefined }
          role="group"
          { ...rest }
        >
          { clonedChildren }
        </div>
      </Skeleton>
    );
  },
);

// Re-export the variant function for consumers that need it (e.g., IconButton)
export { buttonVariants };
