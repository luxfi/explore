import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import { cn } from 'lib/utils/cn';
import type { ImageProps } from '@luxfi/ui/image';
import { Image } from '@luxfi/ui/image';
import type { LinkProps } from 'toolkit/next/link';
import { Link as LinkToolkit } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import type { Props as CopyToClipboardProps } from 'ui/shared/CopyToClipboard';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import type { Props as IconSvgProps } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

import { getContentProps, getIconProps } from './utils';

export type Truncation = 'constant' | 'constant_long' | 'dynamic' | 'tail' | 'none';
export type Variant = 'content' | 'heading' | 'subheading';

export interface EntityBaseProps {
  className?: string;
  href?: string;
  icon?: EntityIconProps;
  link?: LinkProps;
  isLoading?: boolean;
  noTooltip?: boolean;
  noCopy?: boolean;
  noIcon?: boolean;
  noLink?: boolean;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  query?: Record<string, string>;
  tailLength?: number;
  target?: React.HTMLAttributeAnchorTarget;
  truncation?: Truncation;
  truncationMaxSymbols?: number;
  variant?: Variant;
  chain?: ExternalChain;
}

export interface ContainerBaseProps extends Pick<EntityBaseProps, 'className'> {
  children: React.ReactNode;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

const Container = ({ className, children, ...props }: ContainerBaseProps) => {
  return (
    <div
      className={ cn('flex items-center min-w-0', className) }
      { ...props }
    >
      { children }
    </div>
  );
};

export interface LinkBaseProps extends Pick<EntityBaseProps, 'className' | 'onClick' | 'isLoading' | 'href' | 'noLink' | 'query' | 'chain'> {
  children: React.ReactNode;
  variant?: LinkProps['variant'];
  noIcon?: LinkProps['noIcon'];
  external?: LinkProps['external'];
}

const Link = ({ isLoading, children, external, onClick, href, noLink, variant, noIcon }: LinkBaseProps) => {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 0, // for content truncation - https://css-tricks.com/flexbox-truncated-text/
  };

  if (noLink) {
    return null;
  }

  return (
    <LinkToolkit
      { ...styles }
      href={ href }
      loading={ isLoading }
      external={ external }
      onClick={ onClick }
      variant={ variant }
      noIcon={ noIcon }
    >
      { children }
    </LinkToolkit>
  );
};

// Common props for entity icons (Image or IconSvg based)
type EntityIconCommonProps = {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  name?: IconSvgProps['name'];
  className?: string;
};

type EntityIconProps = EntityIconCommonProps & {
  color?: string;
  borderRadius?: string | number;
  marginRight?: string | number;
  boxSize?: string | number;
  mr?: string | number;
  flexShrink?: number;
  minW?: number;
  shield?: IconShieldProps | false;
  hint?: string;
  hintPostfix?: string;
  tooltipInteractive?: boolean;
  size?: number; // for AddressIdenticon in address entity
};

export type IconBaseProps = Pick<EntityBaseProps, 'isLoading' | 'noIcon' | 'variant' | 'chain'> & EntityIconProps;

const Icon = (props: IconBaseProps) => {
  const { isLoading, noIcon, variant, color, borderRadius, marginRight, boxSize, shield, hint, tooltipInteractive, ...rest } = props;

  if (noIcon) {
    return null;
  }

  const styles = getIconProps(props, Boolean(shield));

  const iconElement = (() => {
    const commonProps = {
      marginRight: String(styles.marginRight),
      boxSize: boxSize ?? styles.boxSize,
      borderRadius: String(borderRadius ?? 'base'),
      flexShrink: 0,
      minW: 0,
    };

    if (isLoading) {
      return <Skeleton loading { ...commonProps }/>;
    }

    if ('src' in props) {
      return (
        <Image
          src={ rest.src }
          alt={ rest.alt }
          fallback={ rest.fallback }
          className={ rest.className }
          marginRight={ commonProps.marginRight as string }
          boxSize={ commonProps.boxSize as string }
          borderRadius={ commonProps.borderRadius as string }
          flexShrink={ commonProps.flexShrink }
        />
      );
    }

    return (
      <IconSvg
        name={ rest.name! }
        className={ cn(
          'block shrink-0',
          rest.className,
        ) }
        style={{
          marginRight: String(commonProps.marginRight),
          width: typeof commonProps.boxSize === 'number' ? `${ commonProps.boxSize }px` : String(commonProps.boxSize),
          height: typeof commonProps.boxSize === 'number' ? `${ commonProps.boxSize }px` : String(commonProps.boxSize),
          borderRadius: String(commonProps.borderRadius),
          color: `var(--color-${ (color ?? 'icon.primary').replace(/\./g, '-') })`,
        }}
      />
    );
  })();

  const content = (
    <span className="relative inline-flex items-center shrink-0">
      { iconElement }
      { shield && <IconShield isLoading={ isLoading } variant={ variant } { ...shield }/> }
    </span>
  );

  if (!hint) {
    return content;
  }

  return (
    <Tooltip
      content={ hint }
      interactive={ tooltipInteractive }
      positioning={ shield ? { offset: { mainAxis: 8 } } : undefined }
    >
      { content }
    </Tooltip>
  );
};

type IconShieldProps = (ImageProps | IconSvgProps) & { isLoading?: boolean; variant?: Variant };

const IconShield = (props: IconShieldProps) => {
  const { variant, ...rest } = props;

  const shieldStyle: React.CSSProperties = {
    position: 'absolute',
    top: variant === 'heading' ? '14px' : '6px',
    left: variant === 'heading' ? '18px' : '12px',
    width: '18px',
    height: '18px',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
  };

  const shieldClassName = 'entity__shield';

  if ('src' in rest) {
    const imageProps = {
      boxSize: '18px',
      borderRadius: 'full',
      position: 'absolute' as const,
      top: shieldStyle.top as string,
      left: shieldStyle.left as string,
      className: shieldClassName,
    };
    return rest.isLoading ? <Skeleton loading { ...imageProps }/> : <Image { ...imageProps } { ...rest }/>;
  }

  const svgProps = rest as IconSvgProps;

  return (
    <IconSvg
      { ...svgProps }
      className={ cn(shieldClassName, svgProps.className) }
      style={ shieldStyle }
    />
  );
};

export interface ContentBaseProps extends Pick<
  EntityBaseProps, 'className' | 'isLoading' | 'truncation' | 'tailLength' | 'noTooltip' | 'variant' | 'truncationMaxSymbols' | 'noLink'
> {
  asProp?: React.ElementType;
  text: string;
  tooltipInteractive?: boolean;
}

const Content = ({
  className,
  isLoading,
  asProp,
  text,
  truncation = 'dynamic',
  truncationMaxSymbols,
  tailLength,
  variant,
  noTooltip,
  tooltipInteractive,
  noLink,
}: ContentBaseProps) => {
  const styles = getContentProps(variant);

  if (truncation === 'tail') {
    return (
      <TruncatedText
        text={ text }
        loading={ isLoading }
        className={ className }
        tooltipInteractive={ tooltipInteractive }
        { ...styles }
      />
    );
  }

  const children = (() => {
    switch (truncation) {
      case 'constant_long':
        return (
          <HashStringShorten
            hash={ text }
            as={ asProp }
            type="long"
            noTooltip={ noTooltip }
            tooltipInteractive={ tooltipInteractive }
            maxSymbols={ truncationMaxSymbols }
          />
        );
      case 'constant':
        return (
          <HashStringShorten
            hash={ text }
            as={ asProp }
            noTooltip={ noTooltip }
            tooltipInteractive={ tooltipInteractive }
            maxSymbols={ truncationMaxSymbols }
          />
        );
      case 'dynamic':
        return (
          <HashStringShortenDynamic
            hash={ text }
            as={ asProp }
            tailLength={ tailLength }
            noTooltip={ noTooltip }
            tooltipInteractive={ tooltipInteractive }
          />
        );
      case 'none': {
        const Tag = asProp ?? 'span';
        return <Tag>{ text }</Tag>;
      }
    }
  })();

  return (
    <Skeleton
      className={ cn(className, styles?.className) }
      loading={ isLoading }
      overflow="hidden"
      whiteSpace="nowrap"
      w={ !noLink ? '100%' : undefined }
    >
      { children }
    </Skeleton>
  );
};

export type CopyBaseProps =
  Pick<CopyToClipboardProps, 'isLoading' | 'text' | 'tooltipInteractive'> &
  Pick<EntityBaseProps, 'noCopy' | 'noTooltip'>
;

const Copy = ({ noCopy, ...props }: CopyBaseProps) => {
  if (noCopy) {
    return null;
  }

  return <CopyToClipboard { ...props }/>;
};

export {
  Container,
  Link,
  Icon,
  IconShield,
  Copy,
  Content,
};
