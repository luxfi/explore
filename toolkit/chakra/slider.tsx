import * as RadixSlider from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

export interface SliderProps {
  readonly marks?: Array<number | { readonly value: number; readonly label: React.ReactNode }>;
  readonly label?: React.ReactNode;
  readonly showValue?: boolean;
  readonly value?: Array<number>;
  readonly defaultValue?: Array<number>;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly disabled?: boolean;
  readonly orientation?: 'horizontal' | 'vertical';
  readonly name?: string;
  readonly onValueChange?: (value: Array<number>) => void;
  readonly onValueCommit?: (value: Array<number>) => void;
  readonly className?: string;
}

const THUMB_SIZE = 20;
const TRACK_HEIGHT = 6;

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  function Slider(props, ref) {
    const {
      marks: marksProp,
      label,
      showValue,
      value,
      defaultValue,
      min = 0,
      max = 100,
      step,
      disabled,
      orientation,
      name,
      onValueChange,
      onValueCommit,
      className,
    } = props;

    const resolvedValue = defaultValue ?? value;

    const marks = marksProp?.map((mark) => {
      if (typeof mark === 'number') return { value: mark, label: undefined };
      return mark;
    });

    const hasMarkLabel = Boolean(marks?.some((mark) => mark.label));

    return (
      <div className={ cn('flex flex-col gap-1', className) }>
        { label && !showValue && (
          <label className="text-sm font-medium text-text-secondary">
            { label }
          </label>
        ) }
        { label && showValue && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">
              { label }
            </label>
            <span className="text-sm text-text-secondary">
              { (value ?? defaultValue ?? [])?.join(', ') }
            </span>
          </div>
        ) }

        <RadixSlider.Root
          ref={ ref }
          className={ cn(
            'relative flex w-full touch-none select-none items-center',
            hasMarkLabel && 'mb-6',
          ) }
          value={ value }
          defaultValue={ defaultValue }
          min={ min }
          max={ max }
          step={ step }
          disabled={ disabled }
          orientation={ orientation }
          name={ name }
          onValueChange={ onValueChange }
          onValueCommit={ onValueCommit }
        >
          <RadixSlider.Track
            className={ cn(
              'relative grow rounded-full bg-border-divider',
              `h-[${ TRACK_HEIGHT }px]`,
            ) }
          >
            <RadixSlider.Range className="absolute h-full rounded-full bg-link-primary"/>
          </RadixSlider.Track>

          { resolvedValue?.map((_, index) => (
            <RadixSlider.Thumb
              key={ index }
              className={ cn(
                `block h-[${ THUMB_SIZE }px] w-[${ THUMB_SIZE }px]`,
                'rounded-full border-2 border-link-primary bg-white',
                'shadow-sm transition-colors',
                'hover:border-link-primary-hover',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link-primary focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
              ) }
            />
          )) }
        </RadixSlider.Root>

        <SliderMarks marks={ marks } min={ min } max={ max }/>
      </div>
    );
  },
);

interface SliderMarksProps {
  readonly marks?: Array<{ readonly value: number; readonly label?: React.ReactNode }>;
  readonly min: number;
  readonly max: number;
}

function SliderMarks(props: SliderMarksProps): React.ReactNode {
  const { marks, min, max } = props;
  if (!marks?.length) return null;

  const range = max - min;

  return (
    <div className="relative w-full h-4">
      { marks.map((mark, index) => {
        const percent = ((mark.value - min) / range) * 100;
        return (
          <div
            key={ index }
            className="absolute flex flex-col items-center -translate-x-1/2"
            style={{ left: `${ percent }%` }}
          >
            <div className="h-1.5 w-0.5 bg-border-divider"/>
            { mark.label != null && (
              <span className="mt-0.5 text-xs text-text-secondary whitespace-nowrap">
                { mark.label }
              </span>
            ) }
          </div>
        );
      }) }
    </div>
  );
}
