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
      ...rest
    } = own;

    const linkClasses = cn(BASE_CLASSES, VARIANT_CLASSES[variant], className);

    if (external) {
      const processedHref = typeof href === 'string' ? stripUtmParams(href) : href;

      return (
        <Skeleton loading={ loading } ref={ ref as React.ForwardedRef<HTMLDivElement> } asChild>
          <a
            href={ processedHref }
            className={ cn('group', linkClasses) }
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
      return (
        <NextLink
          ref={ ref }
          { ...next }
          className={ overlayClasses }
          { ...rest }
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
