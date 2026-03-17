import { cva } from 'class-variance-authority';
import * as React from 'react';

import IndicatorIcon from 'icons/info_filled.svg';
import { cn } from 'lib/utils/cn';

import { CloseButton } from './close-button';
import { Skeleton } from './skeleton';

/* ------------------------------------------------------------------ */
/*  Status type                                                        */
/* ------------------------------------------------------------------ */

type AlertStatus = 'info' | 'warning' | 'warning_table' | 'success' | 'error';

/* ------------------------------------------------------------------ */
/*  CVA variants                                                       */
/* ------------------------------------------------------------------ */

const alertRoot = cva(
  // base
  'w-full flex items-start relative rounded text-[var(--color-alert-fg)]',
  {
    variants: {
      status: {
        info: 'bg-[var(--color-alert-bg-info)]',
        warning: 'bg-[var(--color-alert-bg-warning)]',
        warning_table: 'bg-[var(--color-alert-bg-warning-table)]',
        success: 'bg-[var(--color-alert-bg-success)]',
        error: 'bg-[var(--color-alert-bg-error)]',
      },
      size: {
        sm: 'gap-2 px-2 py-2 text-xs',
        md: 'gap-2 px-3 py-2 text-base',
      },
    },
    defaultVariants: {
      status: 'info',
      size: 'md',
    },
  },
);

const alertContent = cva('flex flex-1', {
  variants: {
    inline: {
      'true': 'inline-flex flex-row items-center',
      'false': 'flex flex-col',
    },
  },
  defaultVariants: {
    inline: true,
  },
});

const INDICATOR_BASE = 'inline-flex items-center justify-center shrink-0 w-5 h-5 text-[var(--color-alert-fg)] [&>svg]:w-full [&>svg]:h-full';

const indicatorVariants = cva(INDICATOR_BASE, {
  variants: {
    size: {
      sm: 'w-5 h-5 my-0',
      md: 'w-5 h-5 my-[2px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface AlertProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  readonly status?: AlertStatus;
  readonly size?: 'sm' | 'md';
  readonly inline?: boolean;
  readonly startElement?: React.ReactNode;
  readonly endElement?: React.ReactNode;
  readonly descriptionProps?: React.ComponentPropsWithoutRef<'div'>;
  readonly title?: React.ReactNode;
  readonly icon?: React.ReactElement;
  readonly closable?: boolean;
  readonly onClose?: () => void;
  readonly loading?: boolean;
  readonly showIcon?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    const {
      title,
      children,
      icon,
      closable,
      onClose,
      startElement,
      endElement,
      loading,
      size,
      inline = true,
      showIcon = false,
      descriptionProps,
      status = 'info',
      className,
      ...rest
    } = props;

    const [ isOpen, setIsOpen ] = React.useState(true);

    const resolvedSize = size ?? 'md';

    const defaultIcon = (
      <IndicatorIcon className="w-5 h-5"/>
    );

    const iconElement = (() => {
      if (startElement !== undefined) {
        return startElement;
      }

      if (!showIcon && icon === undefined) {
        return null;
      }

      return (
        <span className={ indicatorVariants({ size: resolvedSize }) }>
          { icon || defaultIcon }
        </span>
      );
    })();

    const handleClose = React.useCallback(() => {
      setIsOpen(false);
      onClose?.();
    }, [ onClose ]);

    if (closable && !isOpen) {
      return null;
    }

    const { className: descClassName, ...descRest } = descriptionProps ?? {};

    return (
      <Skeleton loading={ loading } asChild>
        <div
          ref={ ref }
          className={ cn(alertRoot({ status, size: resolvedSize }), className) }
          { ...rest }
        >
          { iconElement }
          { children ? (
            <div className={ alertContent({ inline }) }>
              { title && <div className="font-semibold">{ title }</div> }
              <div
                className={ cn('inline-flex flex-wrap', descClassName) }
                { ...descRest }
              >
                { children }
              </div>
            </div>
          ) : (
            <div className="font-semibold flex-1">{ title }</div>
          ) }
          { endElement }
          { closable && (
            <CloseButton
              pos="relative"
              alignSelf="flex-start"
              onClick={ handleClose }
            />
          ) }
        </div>
      </Skeleton>
    );
  },
);
