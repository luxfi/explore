import NextLink from 'next/link';
import type { LinkProps as NextLinkProps } from 'next/link';
import React from 'react';

import ArrowIcon from 'icons/link_external.svg';
import { cn } from 'lib/utils/cn';
import stripUtmParams from 'lib/utils/stripUtmParams';

import { Skeleton } from './skeleton';

type LinkVariant = 'primary' | 'secondary' | 'subtle' | 'underlaid' | 'menu' | 'navigation' | 'plain';

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
  Partial<Pick<NextLinkProps, 'shallow' | 'prefetch' | 'scroll'>> {
  readonly href?: string;
  readonly loading?: boolean;
  readonly external?: boolean;
  readonly iconColor?: string;
  readonly noIcon?: boolean;
  readonly disabled?: boolean;
  readonly variant?: LinkVariant;
  readonly asChild?: boolean;
  // Legacy Chakra style-prop shims
  readonly fontWeight?: string | number;
  readonly whiteSpace?: string;
  readonly wordBreak?: string;
  readonly textStyle?: string;
  readonly ml?: number | string | Record<string, string | number>;
  readonly mr?: number | string;
  readonly display?: string;
  readonly alignItems?: string;
  readonly flexShrink?: number;
  readonly minW?: number | string;
  readonly justifyContent?: string;
  readonly position?: string;
}

const VARIANT_CLASSES: Record<LinkVariant, string> = {
  primary: cn(
    'text-[var(--color-link-primary)]',
    'hover:no-underline hover:text-[var(--color-link-primary-hover)]',
    'data-[hover]:no-underline data-[hover]:text-[var(--color-link-primary-hover)]',
  ),
  secondary: cn(
    'text-[var(--color-link-secondary)]',
    'hover:no-underline hover:text-[var(--color-hover)]',
    'data-[hover]:no-underline data-[hover]:text-[var(--color-hover)]',
  ),
  subtle: cn(
    'text-[var(--color-link-subtle)]',
    'hover:text-[var(--color-link-subtle-hover)] hover:underline hover:decoration-[var(--color-link-subtle-hover)]',
    'data-[hover]:text-[var(--color-link-subtle-hover)] data-[hover]:underline data-[hover]:decoration-[var(--color-link-subtle-hover)]',
  ),
  underlaid: cn(
    'text-[var(--color-link-primary)] bg-[var(--color-link-underlaid-bg)]',
    'px-2 py-1.5 rounded-base text-sm',
    'hover:text-[var(--color-link-primary-hover)] hover:no-underline',
    'data-[hover]:text-[var(--color-link-primary-hover)] data-[hover]:no-underline',
  ),
  menu: cn(
    'text-[var(--color-link-menu)]',
    'hover:text-[var(--color-hover)] hover:no-underline',
    'data-[hover]:text-[var(--color-hover)] data-[hover]:no-underline',
  ),
  navigation: cn(
    'text-[var(--color-link-nav-fg)] bg-transparent',
    'hover:text-[var(--color-link-nav-fg-hover)] hover:no-underline',
    'data-[hover]:text-[var(--color-link-nav-fg-hover)] data-[hover]:no-underline',
    'data-[selected]:text-[var(--color-link-nav-fg-selected)] data-[selected]:bg-[var(--color-link-nav-bg-selected)]',
    'data-[active]:text-[var(--color-link-nav-fg-active)]',
  ),
  plain: cn(
    'text-inherit',
    'hover:no-underline',
    'data-[hover]:no-underline',
  ),
};

const BASE_CLASSES = 'inline-flex items-center gap-0 cursor-pointer data-[disabled]:cursor-not-allowed';

export const LinkExternalIcon = ({ color }: { color?: string }) => (
  <ArrowIcon
    className={ cn(
      'size-3 align-middle shrink-0',
      'group-hover:text-inherit',
    ) }
    style={ color ? { color } : { color: 'var(--color-icon-secondary)' } }
    aria-hidden="true"
  />
);

const splitProps = (props: LinkProps): {
  own: Omit<LinkProps, 'scroll' | 'shallow' | 'prefetch'>;
  next: Pick<NextLinkProps, 'href' | 'scroll' | 'shallow' | 'prefetch'>;
} => {
  const { scroll = true, shallow = false, prefetch = false, ...rest } = props;

  return {
    own: rest,
    next: {
      href: (rest.href ?? '') as NextLinkProps['href'],
      scroll,
      shallow,
      prefetch,
    },
  };
};

const SPACING = 4;

function resolveSpacing(v: number | string | Record<string, string | number> | undefined): string | undefined {
  if (v === undefined) return undefined;
  if (typeof v === 'number') return `${ v * SPACING }px`;
  if (typeof v === 'string') return v;
  // Responsive object - use base value
  if (typeof v === 'object' && v !== null) {
    const base = (v as Record<string, string | number>).base;
    if (base !== undefined) return typeof base === 'number' ? `${ base * SPACING }px` : base;
    const lg = (v as Record<string, string | number>).lg;
    if (lg !== undefined) return typeof lg === 'number' ? `${ lg * SPACING }px` : lg;
  }
  return undefined;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const { own, next } = splitProps(props);
    const {
      external,
      loading,
      href,
      children,
      disabled,
      noIcon,
      iconColor,
      variant = 'primary',
      className,
      asChild: _asChild,
      // Strip Chakra style props
      fontWeight: _fontWeight,
      whiteSpace: _whiteSpace,
      wordBreak: _wordBreak,
      textStyle: _textStyle,
      ml: _ml,
      mr: _mr,
      display: _display,
      alignItems: _alignItems,
      flexShrink: _flexShrink,
      minW: _minW,
      justifyContent: _justifyContent,
      position: _position,
      ...rest
    } = own;

    // Build inline style from Chakra style props
    const shimStyle: React.CSSProperties = {};
    if (_fontWeight !== undefined) shimStyle.fontWeight = _fontWeight;
    if (_whiteSpace) shimStyle.whiteSpace = _whiteSpace as React.CSSProperties['whiteSpace'];
    if (_wordBreak) shimStyle.wordBreak = _wordBreak as React.CSSProperties['wordBreak'];
    if (_ml !== undefined) shimStyle.marginLeft = resolveSpacing(_ml);
    if (_mr !== undefined) shimStyle.marginRight = resolveSpacing(_mr);
    if (_display) shimStyle.display = _display;
    if (_alignItems) shimStyle.alignItems = _alignItems;
    if (_flexShrink !== undefined) shimStyle.flexShrink = _flexShrink;
    if (_minW !== undefined) shimStyle.minWidth = typeof _minW === 'number' ? `${ _minW * SPACING }px` : _minW;
    if (_justifyContent) shimStyle.justifyContent = _justifyContent;
    if (_position) shimStyle.position = _position as React.CSSProperties['position'];

    const linkClasses = cn(BASE_CLASSES, VARIANT_CLASSES[variant], className);
    const linkStyle = Object.keys(shimStyle).length > 0 ? shimStyle : undefined;

    if (external) {
      const processedHref = typeof href === 'string' ? stripUtmParams(href) : href;

      return (
        <Skeleton loading={ loading } ref={ ref as React.ForwardedRef<HTMLDivElement> } asChild>
          <a
            href={ processedHref }
            className={ cn('group', linkClasses) }
            style={ linkStyle }
            target="_blank"
            rel="noopener noreferrer"
            { ...(disabled ? { 'data-disabled': true } : {}) }
            { ...rest }
          >
            { children }
            { !noIcon && <LinkExternalIcon color={ iconColor }/> }
          </a>
        </Skeleton>
      );
    }

    return (
      <Skeleton loading={ loading } ref={ ref as React.ForwardedRef<HTMLDivElement> } asChild>
        { next.href ? (
          <NextLink
            { ...next }
            className={ linkClasses }
            style={ linkStyle }
            { ...(disabled ? { 'data-disabled': true } : {}) }
            { ...rest }
          >
            { children }
          </NextLink>
        ) : (
          <span
            className={ linkClasses }
            { ...(disabled ? { 'data-disabled': true } : {}) }
            { ...rest as React.HTMLAttributes<HTMLSpanElement> }
          >
            { children }
          </span>
        ) }
      </Skeleton>
    );
  },
);

export const LinkBox = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function LinkBox(props, ref) {
    const { className, ...rest } = props;
    return (
      <div
        ref={ ref }
        className={ cn('relative', className) }
        { ...rest }
      />
    );
  },
);

export const LinkOverlay = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function LinkOverlay(props, ref) {
    const { own, next } = splitProps(props);
    const {
      children,
      external,
      loading,
      href,
      noIcon,
      iconColor,
      variant = 'primary',
      className,
      disabled,
      asChild: _asChild2,
      fontWeight: _fw2, whiteSpace: _ws2, wordBreak: _wb2, textStyle: _ts2,
      ml: _ml2, mr: _mr2, display: _d2, alignItems: _ai2, flexShrink: _fs2,
      minW: _mw2, justifyContent: _jc2, position: _p2,
      ...rest
    } = own;

    const overlayClasses = cn(
      BASE_CLASSES,
      VARIANT_CLASSES[variant],
      // Static positioning with a ::before pseudo-element that covers the LinkBox
      'static',
      'before:absolute before:inset-0 before:z-0 before:content-[""]',
      className,
    );

    if (external) {
      const processedHref = typeof href === 'string' ? stripUtmParams(href) : href;

      return (
        <a
          ref={ ref }
          href={ loading ? undefined : processedHref }
          className={ overlayClasses }
          target="_blank"
          rel="noopener noreferrer"
          { ...rest }
        >
          { (children || (!noIcon && href)) && (
            <Skeleton display="inline-flex" alignItems="center" loading={ loading } maxW="100%" h="100%">
              { children }
              { !noIcon && href && <LinkExternalIcon color={ iconColor }/> }
            </Skeleton>
          ) }
        </a>
      );
    }

    const content = children ? (
      <Skeleton display="inline-flex" alignItems="center" loading={ loading } maxW="100%" h="100%">
        { children }
      </Skeleton>
    ) : null;

    if (next.href) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anchorRest = rest as any;
      return (
        <NextLink
          ref={ ref }
          { ...next }
          className={ overlayClasses }
          { ...anchorRest }
        >
          { content }
        </NextLink>
      );
    }

    return (
      <span
        ref={ ref as React.ForwardedRef<HTMLDivElement> }
        className={ overlayClasses }
        { ...rest as React.HTMLAttributes<HTMLSpanElement> }
      >
        { content }
      </span>
    );
  },
);
