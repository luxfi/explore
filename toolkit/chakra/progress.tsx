import * as RadixProgress from '@radix-ui/react-progress';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

const SIZE_CLASSES = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
  xl: 'h-4',
} as const;

type Size = keyof typeof SIZE_CLASSES;

interface TrackProps {
  readonly borderStartRadius?: number | string;
  readonly borderEndRadius?: number | string;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

interface ProgressProps extends React.ComponentPropsWithoutRef<'div'> {
  readonly value?: number | null;
  readonly min?: number;
  readonly max?: number;
  readonly size?: Size;
  readonly color?: string;
  readonly trackProps?: TrackProps;

  // Common Chakra layout shorthands that consumers currently pass.
  readonly w?: string;
  readonly flex?: string | number;
}

function normalizeValue(value: number | null | undefined, min: number, max: number): number {
  if (value == null) return 0;
  if (max <= min) return 0;
  return Math.round(((value - min) / (max - min)) * 100);
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(props, ref) {
    const {
      value,
      min = 0,
      max = 100,
      size = 'md',
      color,
      trackProps,
      className,
      style,
      w,
      flex,
      ...rest
    } = props;

    const percent = normalizeValue(value, min, max);

    const trackStyle: React.CSSProperties = {
      ...trackProps?.style,
      ...(trackProps?.borderStartRadius !== undefined && {
        borderStartStartRadius: trackProps.borderStartRadius,
        borderEndStartRadius: trackProps.borderStartRadius,
      }),
      ...(trackProps?.borderEndRadius !== undefined && {
        borderStartEndRadius: trackProps.borderEndRadius,
        borderEndEndRadius: trackProps.borderEndRadius,
      }),
    };

    const rootStyle: React.CSSProperties = {
      ...style,
      ...(w !== undefined && { width: w === 'full' ? '100%' : w }),
      ...(flex !== undefined && { flex }),
    };

    return (
      <div
        ref={ ref }
        className={ cn('relative', className) }
        style={ rootStyle }
        { ...rest }
      >
        <RadixProgress.Root
          value={ percent }
          max={ 100 }
          className={ cn(
            'w-full overflow-hidden rounded-full',
            'bg-[var(--color-progress-track)]',
            SIZE_CLASSES[size],
            trackProps?.className,
          ) }
          style={ trackStyle }
        >
          <RadixProgress.Indicator
            className={ cn(
              'h-full rounded-full transition-transform duration-500 ease-out',
              !color && 'bg-[var(--color-progress-indicator)]',
            ) }
            style={{
              width: `${ percent }%`,
              ...(color && { backgroundColor: `var(--color-${ color.replace('.', '-') }, ${ color })` }),
            }}
          />
        </RadixProgress.Root>
      </div>
    );
  },
);
