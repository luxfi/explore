import * as React from 'react';

import { cn } from 'lib/utils/cn';

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly loading: boolean | undefined;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(props, ref) {
    const { loading = false, className, children, ...rest } = props;

    if (!loading) {
      return (
        <div ref={ ref } className={ className } { ...rest }>
          { children }
        </div>
      );
    }

    return (
      <div
        ref={ ref }
        data-loading
        className={ cn(
          'animate-skeleton-shimmer rounded-sm',
          'bg-[linear-gradient(90deg,var(--color-skeleton-start)_0%,var(--color-skeleton-end)_50%,var(--color-skeleton-start)_100%)]',
          'bg-[length:200%_100%]',
          children ? 'text-transparent [&_*]:invisible' : 'min-h-5',
          className,
        ) }
        { ...rest }
      >
        { children }
      </div>
    );
  },
);

// ---------------------------------------------------------------------------
// SkeletonCircle
// ---------------------------------------------------------------------------

export interface SkeletonCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly size?: string | number;
  readonly loading?: boolean;
}

export const SkeletonCircle = React.forwardRef<HTMLDivElement, SkeletonCircleProps>(
  function SkeletonCircle(props, ref) {
    const { size = 40, loading = true, className, ...rest } = props;

    const dimension = typeof size === 'number' ? `${ size }px` : size;

    return (
      <Skeleton
        ref={ ref }
        loading={ loading }
        className={ cn('rounded-full shrink-0', className) }
        style={{ width: dimension, height: dimension, ...rest.style }}
        { ...rest }
      />
    );
  },
);

// ---------------------------------------------------------------------------
// SkeletonText
// ---------------------------------------------------------------------------

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly noOfLines?: number;
  readonly loading?: boolean;
}

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText(props, ref) {
    const { noOfLines = 3, loading = true, className, ...rest } = props;

    return (
      <div ref={ ref } className={ cn('flex w-full flex-col gap-2', className) } { ...rest }>
        { Array.from({ length: noOfLines }).map((_, index) => (
          <Skeleton
            key={ index }
            loading={ loading }
            className={ cn('h-4', index === noOfLines - 1 && 'max-w-[80%]') }
          />
        )) }
      </div>
    );
  },
);
