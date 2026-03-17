import * as React from 'react';

import { cn } from 'lib/utils/cn';

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  readonly loading: boolean | undefined;

  /** When true, the Skeleton wraps its single child element instead of adding a wrapper div. */
  readonly asChild?: boolean;

  // Legacy Chakra style-prop shims — converted to className / inline style.
  readonly w?: string | number | Record<string, string>;
  readonly h?: string | number | Record<string, string>;
  readonly minW?: string | number | Record<string, string>;
  readonly maxW?: string | number | Record<string, string>;
  readonly display?: string;
  readonly flexGrow?: number;
  readonly flexShrink?: number;
  readonly flexBasis?: string;
  readonly fontWeight?: number | string;
  readonly textStyle?: string;
  readonly borderRadius?: string;
  readonly alignSelf?: string;
  readonly alignItems?: string;
  readonly justifyContent?: string;
  readonly color?: string;
  readonly mt?: number | string;
  readonly mb?: number | string;
  readonly ml?: number | string;
  readonly mr?: number | string;
  readonly height?: string;
  readonly overflow?: string;
  readonly whiteSpace?: string;
  readonly textOverflow?: string;
  readonly textTransform?: string;
  readonly gap?: number | string;
  readonly gridTemplateColumns?: string;
  readonly minWidth?: string;
  readonly boxSize?: number | string;
  readonly py?: number | string;
  readonly px?: number | string;
  readonly p?: number | string;
  readonly hideBelow?: string;
  readonly as?: React.ElementType;
  readonly fontSize?: string;
  readonly flexWrap?: string;
  readonly wordBreak?: string;
  readonly lineHeight?: string;
  readonly marginRight?: string;
  readonly position?: string;
  readonly background?: string;
}

const SPACING_SCALE = 4;

function toStylePx(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value;
  return `${ value * SPACING_SCALE }px`;
}

function extractSkeletonStyleProps(props: Record<string, unknown>): {
  style: React.CSSProperties;
  rest: Record<string, unknown>;
} {
  const style: React.CSSProperties = {};
  const rest: Record<string, unknown> = {};

  function resolveDimension(value: unknown): string | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'number') return `${ value * SPACING_SCALE }px`;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      const obj = value as Record<string, string>;
      return obj.base ?? obj.lg ?? obj.xl ?? Object.values(obj)[0];
    }
    return undefined;
  }

  for (const [ key, value ] of Object.entries(props)) {
    if (value === undefined) continue;
    switch (key) {
      case 'w': {
        const v = resolveDimension(value); if (v) style.width = v; break;
      }
      case 'h': {
        const v = resolveDimension(value); if (v) style.height = v; break;
      }
      case 'minW': {
        const v = resolveDimension(value); if (v) style.minWidth = v; break;
      }
      case 'maxW': {
        const v = resolveDimension(value); if (v) style.maxWidth = v; break;
      }
      case 'height': style.height = value as string; break;
      case 'display': style.display = value as string; break;
      case 'flexGrow': style.flexGrow = value as number; break;
      case 'flexShrink': style.flexShrink = value as number; break;
      case 'flexBasis': style.flexBasis = value as string; break;
      case 'fontWeight': style.fontWeight = value as number | string; break;
      case 'borderRadius': style.borderRadius = value as string; break;
      case 'alignSelf': style.alignSelf = value as string; break;
      case 'alignItems': style.alignItems = value as string; break;
      case 'justifyContent': style.justifyContent = value as string; break;
      case 'color': style.color = value as string; break;
      case 'mt': style.marginTop = toStylePx(value as number | string); break;
      case 'mb': style.marginBottom = toStylePx(value as number | string); break;
      case 'ml': style.marginLeft = toStylePx(value as number | string); break;
      case 'mr': style.marginRight = toStylePx(value as number | string); break;
      case 'overflow': style.overflow = value as string; break;
      case 'whiteSpace': style.whiteSpace = value as string; break;
      case 'textOverflow': style.textOverflow = value as string; break;
      case 'textTransform': style.textTransform = value as string; break;
      case 'gap': style.gap = typeof value === 'number' ? `${ value * SPACING_SCALE }px` : value as string; break;
      case 'gridTemplateColumns': style.gridTemplateColumns = value as string; break;
      case 'minWidth': style.minWidth = value as string; break;
      case 'boxSize': {
        const s = typeof value === 'number' ? `${ value * SPACING_SCALE }px` : value as string; style.width = s; style.height = s; break;
      }
      case 'py': {
        const v = toStylePx(value as number | string); style.paddingTop = v; style.paddingBottom = v; break;
      }
      case 'px': {
        const v = toStylePx(value as number | string); style.paddingLeft = v; style.paddingRight = v; break;
      }
      case 'p': {
        const v = toStylePx(value as number | string); style.padding = v; break;
      }
      case 'hideBelow': break; // handled via className
      case 'textStyle': break; // drop textStyle, not directly applicable
      case 'fontSize': style.fontSize = value as string; break;
      case 'flexWrap': style.flexWrap = value as string; break;
      case 'wordBreak': style.wordBreak = value as string; break;
      case 'lineHeight': style.lineHeight = value as string; break;
      case 'marginRight': style.marginRight = value as string; break;
      case 'position': style.position = value as string; break;
      case 'background': style.background = value as string; break;
      default: rest[key] = value; break;
    }
  }

  return { style, rest };
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(props, ref) {
    const {
      loading = false,
      asChild,
      className,
      children,
      style: styleProp,
      // Destructure style-prop shims so they don't leak into DOM
      w: _w, h: _h, minW: _minW, maxW: _maxW, display: _display,
      flexGrow: _flexGrow, flexShrink: _flexShrink, flexBasis: _flexBasis,
      fontWeight: _fontWeight, textStyle: _textStyle, borderRadius: _borderRadius,
      alignSelf: _alignSelf, alignItems: _alignItems, justifyContent: _justifyContent,
      color: _color, mt: _mt, mb: _mb, ml: _ml, mr: _mr, height: _height,
      overflow: _overflow, whiteSpace: _whiteSpace, textOverflow: _textOverflow,
      textTransform: _textTransform, gap: _gap, gridTemplateColumns: _gridTemplateColumns,
      minWidth: _minWidth, boxSize: _boxSize, py: _py, px: _px, p: _p,
      hideBelow: _hideBelow, fontSize: _fontSize, flexWrap: _flexWrap, wordBreak: _wordBreak, lineHeight: _lineHeight,
      marginRight: _marginRight, position: _position, background: _background,
      as: Component = 'div',
      ...htmlRest
    } = props;

    // Collect legacy style props into a CSSProperties object
    const { style: shimStyle } = extractSkeletonStyleProps({
      w: _w, h: _h, minW: _minW, maxW: _maxW, display: _display,
      flexGrow: _flexGrow, flexShrink: _flexShrink, flexBasis: _flexBasis,
      fontWeight: _fontWeight, textStyle: _textStyle, borderRadius: _borderRadius,
      alignSelf: _alignSelf, alignItems: _alignItems, justifyContent: _justifyContent,
      color: _color, mt: _mt, mb: _mb, ml: _ml, mr: _mr, height: _height,
      overflow: _overflow, whiteSpace: _whiteSpace, textOverflow: _textOverflow,
      textTransform: _textTransform, gap: _gap, gridTemplateColumns: _gridTemplateColumns,
      minWidth: _minWidth, boxSize: _boxSize, py: _py, px: _px, p: _p,
      hideBelow: _hideBelow, fontSize: _fontSize, flexWrap: _flexWrap, wordBreak: _wordBreak, lineHeight: _lineHeight,
      marginRight: _marginRight, position: _position, background: _background,
    });
    const mergedStyle = Object.keys(shimStyle).length > 0 || styleProp ?
      { ...shimStyle, ...styleProp } :
      undefined;

    const HIDE_BELOW_MAP: Record<string, string> = { lg: 'lg:hidden', md: 'md:hidden', sm: 'sm:hidden' };
    const hideBelowClass = _hideBelow ? HIDE_BELOW_MAP[_hideBelow] : undefined;
    const finalClassName = hideBelowClass ? cn(className, hideBelowClass) : className;

    if (!loading) {
      // When asChild is true, render children directly without a wrapper div
      if (asChild && React.isValidElement(children)) {
        return children;
      }
      return (
        <Component ref={ ref } className={ finalClassName } style={ mergedStyle } { ...htmlRest }>
          { children }
        </Component>
      );
    }

    // When asChild is true and loading, wrap the child in skeleton styles
    if (asChild && React.isValidElement(children)) {
      return (
        <Component
          ref={ ref }
          data-loading
          className={ cn(
            'animate-skeleton-shimmer rounded-sm',
            'bg-[linear-gradient(90deg,var(--color-skeleton-start)_0%,var(--color-skeleton-end)_50%,var(--color-skeleton-start)_100%)]',
            'bg-[length:200%_100%]',
            'text-transparent [&_*]:invisible',
            finalClassName,
          ) }
          style={ mergedStyle }
          { ...htmlRest }
        >
          { children }
        </Component>
      );
    }

    return (
      <Component
        ref={ ref }
        data-loading
        className={ cn(
          'animate-skeleton-shimmer rounded-sm',
          'bg-[linear-gradient(90deg,var(--color-skeleton-start)_0%,var(--color-skeleton-end)_50%,var(--color-skeleton-start)_100%)]',
          'bg-[length:200%_100%]',
          children ? 'text-transparent [&_*]:invisible' : 'min-h-5',
          finalClassName,
        ) }
        style={ mergedStyle }
        { ...htmlRest }
      >
        { children }
      </Component>
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
