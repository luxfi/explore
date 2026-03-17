import React from 'react';

import { cn } from 'lib/utils/cn';

import { Skeleton } from './skeleton';

type CSSValue = string | number | undefined;
type ResponsiveValue<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T; _light?: T; _dark?: T };

// Style props accepted for backward compatibility with Chakra callers.
// These are converted to inline styles on the <img> element.
interface StyleProps {
  boxSize?: CSSValue;
  borderRadius?: CSSValue;
  width?: CSSValue;
  w?: CSSValue;
  height?: CSSValue;
  h?: ResponsiveValue<CSSValue>;
  maxW?: CSSValue;
  maxH?: CSSValue;
  minW?: CSSValue;
  mr?: CSSValue;
  mb?: CSSValue;
  ml?: CSSValue;
  mt?: CSSValue;
  mx?: CSSValue;
  my?: CSSValue;
  marginRight?: CSSValue;
  display?: CSSValue;
  position?: CSSValue;
  top?: CSSValue;
  left?: ResponsiveValue<CSSValue>;
  right?: CSSValue;
  bottom?: CSSValue;
  zIndex?: CSSValue;
  objectFit?: CSSValue;
  objectPosition?: CSSValue;
  flexShrink?: CSSValue;
  overflow?: CSSValue;
}

export interface ImageProps extends StyleProps {
  readonly className?: string;
  readonly src?: string;
  readonly alt?: string;
  readonly style?: React.CSSProperties;
  readonly fallback?: React.ReactNode;
  readonly onLoad?: React.ReactEventHandler<HTMLImageElement>;
  readonly onError?: React.ReactEventHandler<HTMLImageElement>;
  // for the case where the image dimensions are not known before the image is loaded
  readonly skeletonWidth?: CSSValue;
  readonly skeletonHeight?: CSSValue;
}

const CHAKRA_SPACING_SCALE: Record<string, string> = {
  '0': '0px',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
};

const CHAKRA_RADII: Record<string, string> = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

function resolveSize(value: CSSValue): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${value}px`;
  if (CHAKRA_SPACING_SCALE[value]) return CHAKRA_SPACING_SCALE[value];
  return value;
}

function resolveRadius(value: CSSValue): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return `${value}px`;
  if (CHAKRA_RADII[value as string]) return CHAKRA_RADII[value as string];
  return String(value);
}

function resolveSimple(value: CSSValue): string | number | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? value : value;
}

// Extract the "base" value from a responsive value or plain value
function baseValue<T>(val: ResponsiveValue<T> | undefined): T | undefined {
  if (val === undefined) return undefined;
  if (typeof val === 'object' && val !== null && ('base' in val || 'md' in val || 'lg' in val)) {
    return (val as { base?: T }).base;
  }
  return val as T;
}

function buildStyle(props: StyleProps): React.CSSProperties {
  const s: React.CSSProperties = {};

  const size = resolveSize(props.boxSize);
  if (size) {
    s.width = size;
    s.height = size;
  }

  const w = resolveSize(props.width ?? props.w);
  if (w) s.width = w;

  const hVal = baseValue(props.height ?? props.h);
  const h = resolveSize(hVal);
  if (h) s.height = h;

  const maxW = resolveSize(props.maxW);
  if (maxW) s.maxWidth = maxW;

  const maxH = resolveSize(props.maxH);
  if (maxH) s.maxHeight = maxH;

  const minW = resolveSize(props.minW);
  if (minW) s.minWidth = minW;

  const br = resolveRadius(props.borderRadius);
  if (br) s.borderRadius = br;

  const mr = resolveSize(props.marginRight ?? props.mr);
  if (mr) s.marginRight = mr;

  const ml = resolveSize(props.ml);
  if (ml) s.marginLeft = ml;

  const mt = resolveSize(props.mt);
  if (mt) s.marginTop = mt;

  const mb = resolveSize(props.mb);
  if (mb) s.marginBottom = mb;

  const mx = resolveSize(props.mx);
  if (mx) { s.marginLeft = mx; s.marginRight = mx; }

  const my = resolveSize(props.my);
  if (my) { s.marginTop = my; s.marginBottom = my; }

  if (props.display !== undefined) s.display = String(props.display) as React.CSSProperties['display'];
  if (props.position !== undefined) s.position = String(props.position) as React.CSSProperties['position'];

  const top = resolveSimple(props.top);
  if (top !== undefined) s.top = typeof top === 'number' ? `${top}px` : top;

  const leftVal = baseValue(props.left);
  const left = resolveSimple(leftVal);
  if (left !== undefined) s.left = typeof left === 'number' ? `${left}px` : left;

  const right = resolveSimple(props.right);
  if (right !== undefined) s.right = typeof right === 'number' ? `${right}px` : right;

  const bottom = resolveSimple(props.bottom);
  if (bottom !== undefined) s.bottom = typeof bottom === 'number' ? `${bottom}px` : bottom;

  if (props.zIndex !== undefined) s.zIndex = typeof props.zIndex === 'number' ? props.zIndex : Number(props.zIndex) || undefined;
  if (props.objectFit !== undefined) s.objectFit = String(props.objectFit) as React.CSSProperties['objectFit'];
  if (props.objectPosition !== undefined) s.objectPosition = String(props.objectPosition);
  if (props.flexShrink !== undefined) s.flexShrink = typeof props.flexShrink === 'number' ? props.flexShrink : Number(props.flexShrink);
  if (props.overflow !== undefined) s.overflow = String(props.overflow) as React.CSSProperties['overflow'];

  return s;
}

// Keys that are style props and should NOT be forwarded to the <img> element
const STYLE_PROP_KEYS = new Set<string>([
  'boxSize', 'borderRadius', 'width', 'w', 'height', 'h',
  'maxW', 'maxH', 'minW',
  'mr', 'mb', 'ml', 'mt', 'mx', 'my', 'marginRight',
  'display', 'position', 'top', 'left', 'right', 'bottom',
  'zIndex', 'objectFit', 'objectPosition', 'flexShrink', 'overflow',
]);

function extractStyleProps(props: Record<string, unknown>): { styleProps: StyleProps; rest: Record<string, unknown> } {
  const styleProps: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const key in props) {
    if (STYLE_PROP_KEYS.has(key)) {
      styleProps[key] = props[key];
    } else {
      rest[key] = props[key];
    }
  }

  return { styleProps: styleProps as StyleProps, rest };
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  function Image(props, ref) {
    const { fallback, src, onLoad, onError, skeletonWidth, skeletonHeight, alt, className, style: styleProp, ...allRest } = props;

    const { styleProps, rest: extraProps } = extractStyleProps(allRest as Record<string, unknown>);

    const [ loading, setLoading ] = React.useState(true);
    const [ error, setError ] = React.useState(false);

    const handleLoadError = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
      setError(true);
      setLoading(false);
      onError?.(event);
    }, [ onError ]);

    const handleLoadSuccess = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoading(false);
      onLoad?.(event);
    }, [ onLoad ]);

    // For fallback rendering, pass through all original style props so Chakra-based fallbacks still work
    const passthroughProps = allRest;

    if (!src && fallback) {
      if (React.isValidElement(fallback)) {
        return React.cloneElement(fallback, passthroughProps);
      }
      return fallback;
    }

    if (error) {
      if (React.isValidElement(fallback)) {
        return React.cloneElement(fallback, passthroughProps);
      }
      return fallback;
    }

    const skeletonProps = {
      ...passthroughProps,
      ...(skeletonWidth !== undefined && { width: skeletonWidth }),
      ...(skeletonHeight !== undefined && { height: skeletonHeight }),
    };

    const computedStyle = buildStyle(styleProps);
    const mergedStyle: React.CSSProperties = {
      ...computedStyle,
      ...styleProp,
      display: loading ? 'none' : (computedStyle.display || styleProp?.display || 'block'),
    };

    return (
      <>
        { loading && <Skeleton loading { ...skeletonProps }/> }
        <img
          ref={ ref }
          src={ src }
          alt={ alt || '' }
          onError={ handleLoadError }
          onLoad={ handleLoadSuccess }
          className={ cn(className) }
          style={ mergedStyle }
          { ...extraProps }
        />
      </>
    );
  },
);
