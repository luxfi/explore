import * as React from 'react';

import { cn } from 'lib/utils/cn';

// ---------------------------------------------------------------------------
// Size presets matching the original Chakra progressCircle recipe
// ---------------------------------------------------------------------------

const SIZE_MAP = {
  xs: { size: 24, thickness: 4, textClass: 'text-[10px]' },
  sm: { size: 32, thickness: 5, textClass: 'text-[10px]' },
  md: { size: 40, thickness: 6, textClass: 'text-xs' },
  lg: { size: 48, thickness: 7, textClass: 'text-sm' },
  xl: { size: 64, thickness: 8, textClass: 'text-sm' },
} as const;

type Size = keyof typeof SIZE_MAP;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ProgressCircleCtx {
  readonly value: number | null;
  readonly size: Size;
  readonly colorPalette: string;
}

const Ctx = React.createContext<ProgressCircleCtx>({
  value: 0,
  size: 'md',
  colorPalette: 'blue',
});

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface ProgressCircleRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  readonly value?: number | null;
  readonly size?: Size;
  readonly colorPalette?: string;
}

export const ProgressCircleRoot = React.forwardRef<
  HTMLDivElement,
  ProgressCircleRootProps
>(function ProgressCircleRoot(props, ref) {
  const {
    value = 0,
    size = 'md',
    colorPalette = 'blue',
    className,
    children,
    ...rest
  } = props;

  const ctx = React.useMemo<ProgressCircleCtx>(
    () => ({ value: value ?? null, size, colorPalette }),
    [ value, size, colorPalette ],
  );

  return (
    <Ctx.Provider value={ ctx }>
      <div
        ref={ ref }
        role="progressbar"
        aria-valuenow={ value ?? undefined }
        aria-valuemin={ 0 }
        aria-valuemax={ 100 }
        className={ cn('relative inline-flex text-sm', className) }
        { ...rest }
      >
        { children }
      </div>
    </Ctx.Provider>
  );
});

// ---------------------------------------------------------------------------
// Ring (SVG track + range arc)
// ---------------------------------------------------------------------------

export interface ProgressCircleRingProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, 'color'> {
  readonly trackColor?: string;
  readonly cap?: React.SVGAttributes<SVGCircleElement>['strokeLinecap'];
  readonly color?: string;
}

export const ProgressCircleRing = React.forwardRef<
  SVGSVGElement,
  ProgressCircleRingProps
>(function ProgressCircleRing(props, ref) {
  const { trackColor, cap, color, className, ...rest } = props;
  const { value, size: sizeKey } = React.useContext(Ctx);

  const { size, thickness } = SIZE_MAP[sizeKey];
  const radius = size / 2 - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = value ?? 0;
  const offset = circumference * ((100 - percent) / 100);

  return (
    <svg
      ref={ ref }
      width={ size }
      height={ size }
      viewBox={ `0 0 ${ size } ${ size }` }
      className={ cn(
        value === null && 'animate-spin',
        className,
      ) }
      { ...rest }
    >
      { /* Track */ }
      <circle
        cx={ size / 2 }
        cy={ size / 2 }
        r={ radius }
        fill="transparent"
        strokeWidth={ thickness }
        stroke={ trackColor ?? 'currentColor' }
        className={ !trackColor ? 'opacity-20' : undefined }
      />
      { /* Range */ }
      <circle
        cx={ size / 2 }
        cy={ size / 2 }
        r={ radius }
        fill="transparent"
        strokeWidth={ thickness }
        stroke={ color ?? 'currentColor' }
        strokeLinecap={ cap }
        strokeDasharray={ circumference }
        strokeDashoffset={ offset }
        style={{
          transformOrigin: 'center',
          transform: 'rotate(-90deg)',
          transition: 'stroke-dashoffset 0.6s, stroke-dasharray 0.6s',
          opacity: percent === 0 ? 0 : undefined,
        }}
      />
    </svg>
  );
});

// ---------------------------------------------------------------------------
// Value text (centered number)
// ---------------------------------------------------------------------------

export interface ProgressCircleValueTextProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ProgressCircleValueText = React.forwardRef<
  HTMLDivElement,
  ProgressCircleValueTextProps
>(function ProgressCircleValueText(props, ref) {
  const { className, children, ...rest } = props;
  const { value, size: sizeKey } = React.useContext(Ctx);

  const { textClass } = SIZE_MAP[sizeKey];

  return (
    <div
      ref={ ref }
      aria-live="polite"
      className={ cn(
        'absolute inset-0 flex items-center justify-center',
        'font-medium tracking-tight tabular-nums leading-none',
        textClass,
        className,
      ) }
      { ...rest }
    >
      { children ?? `${ Math.round(value ?? 0) }%` }
    </div>
  );
});
