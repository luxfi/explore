'use client';

import * as RadixAvatar from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

// -- Size & variant mappings ------------------------------------------------

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type AvatarVariant = 'solid' | 'subtle' | 'outline';

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-20 w-20 text-xl',
};

const VARIANT_CLASSES: Record<AvatarVariant, string> = {
  solid: 'bg-gray-500 text-white',
  subtle: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  outline: 'border-2 border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-200',
};

const DEFAULT_SIZE: AvatarSize = 'md';
const DEFAULT_VARIANT: AvatarVariant = 'subtle';

// -- Context for AvatarGroup ------------------------------------------------

interface AvatarGroupContextValue {
  readonly size?: AvatarSize;
  readonly variant?: AvatarVariant;
  readonly borderless?: boolean;
}

const AvatarGroupContext = React.createContext<AvatarGroupContextValue>({});

function useAvatarGroupContext(): AvatarGroupContextValue {
  return React.useContext(AvatarGroupContext);
}

// -- Avatar -----------------------------------------------------------------

export interface AvatarProps extends React.ComponentPropsWithoutRef<'span'> {
  name?: string;
  src?: string;
  srcSet?: string;
  loading?: ImageProps['loading'];
  icon?: React.ReactElement;
  fallback?: React.ReactNode;
  size?: AvatarSize;
  variant?: AvatarVariant;
  borderless?: boolean;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar(props, ref) {
    const group = useAvatarGroupContext();
    const {
      name,
      src,
      srcSet,
      loading,
      icon,
      fallback,
      children,
      className,
      size: sizeProp,
      variant: variantProp,
      borderless,
      ...rest
    } = props;

    const size = sizeProp ?? group.size ?? DEFAULT_SIZE;
    const variant = variantProp ?? group.variant ?? DEFAULT_VARIANT;
    const isBorderless = borderless ?? group.borderless ?? false;

    return (
      <RadixAvatar.Root
        ref={ ref }
        className={ cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full align-middle',
          SIZE_CLASSES[size],
          VARIANT_CLASSES[variant],
          !isBorderless && 'ring-2 ring-white dark:ring-gray-900',
          className,
        ) }
        { ...rest }
      >
        <AvatarFallback name={ name } icon={ icon }>
          { fallback }
        </AvatarFallback>
        <RadixAvatar.Image
          className="h-full w-full rounded-[inherit] object-cover"
          src={ src }
          srcSet={ srcSet }
          loading={ loading }
          alt={ name ?? '' }
        />
        { children }
      </RadixAvatar.Root>
    );
  },
);

// -- AvatarFallback (internal) ----------------------------------------------

interface AvatarFallbackInternalProps extends React.ComponentPropsWithoutRef<'span'> {
  name?: string;
  icon?: React.ReactElement;
}

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackInternalProps>(
  function AvatarFallback(props, ref) {
    const { name, icon, children, className, ...rest } = props;
    return (
      <RadixAvatar.Fallback
        ref={ ref }
        className={ cn(
          'flex h-full w-full items-center justify-center font-medium',
          className,
        ) }
        { ...rest }
      >
        { children }
        { name != null && children == null && <>{ getInitials(name) }</> }
        { name == null && children == null && icon }
      </RadixAvatar.Fallback>
    );
  },
);

// -- getInitials ------------------------------------------------------------

function getInitials(name: string): string {
  const names = name.trim().split(' ');
  const firstName = names[0] != null ? names[0] : '';
  const lastName = names.length > 1 ? names[names.length - 1] : '';
  return firstName && lastName ?
    `${ firstName.charAt(0) }${ lastName.charAt(0) }` :
    firstName.charAt(0);
}

// -- AvatarGroup ------------------------------------------------------------

interface AvatarGroupProps extends React.ComponentPropsWithoutRef<'div'> {
  size?: AvatarSize;
  variant?: AvatarVariant;
  borderless?: boolean;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(props, ref) {
    const { size, variant, borderless, className, ...rest } = props;
    const contextValue = React.useMemo(
      () => ({ size, variant, borderless }),
      [ size, variant, borderless ],
    );
    return (
      <AvatarGroupContext.Provider value={ contextValue }>
        <div
          ref={ ref }
          className={ cn('flex -space-x-3', className) }
          { ...rest }
        />
      </AvatarGroupContext.Provider>
    );
  },
);
