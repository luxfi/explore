import * as RadixPopover from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

import { CloseButton } from './close-button';

// --- Utility: map Chakra-style placement string to Radix side + align ---

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

interface PlacementMapping {
  readonly side: Side;
  readonly align: Align;
}

function parsePlacement(placement: string | undefined): PlacementMapping {
  if (!placement) {
    return { side: 'bottom', align: 'start' };
  }

  const parts = placement.split('-');
  const side = (parts[0] as Side) ?? 'bottom';
  const alignPart = parts[1];

  let align: Align = 'center';
  if (alignPart === 'start') {
    align = 'start';
  } else if (alignPart === 'end') {
    align = 'end';
  }

  return { side, align };
}

// --- PopoverRoot ---

interface Positioning {
  readonly placement?: string;
  readonly offset?: {
    readonly mainAxis?: number;
    readonly crossAxis?: number;
  };
  readonly overflowPadding?: number;
}

export interface PopoverRootProps {
  readonly children?: React.ReactNode;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;

  /** Chakra-style callback: receives `{ open: boolean }` */
  readonly onOpenChange?: (details: { open: boolean }) => void;
  readonly positioning?: Positioning;
  readonly lazyMount?: boolean;
  readonly unmountOnExit?: boolean;
  readonly autoFocus?: boolean;
  readonly closeOnInteractOutside?: boolean;
  readonly modal?: boolean;
}

// Stash positioning info in context so PopoverContent can read it.
interface PopoverPositioning {
  readonly side: Side;
  readonly align: Align;
  readonly sideOffset: number;
  readonly alignOffset: number;
  readonly collisionPadding: number;
  readonly autoFocus: boolean;
  readonly closeOnInteractOutside: boolean;
}

const PositioningContext = React.createContext<PopoverPositioning>({
  side: 'bottom',
  align: 'start',
  sideOffset: 4,
  alignOffset: 0,
  collisionPadding: 4,
  autoFocus: false,
  closeOnInteractOutside: true,
});

export const PopoverRoot = (props: PopoverRootProps): React.ReactElement => {
  const {
    children,
    open,
    defaultOpen,
    onOpenChange,
    positioning,
    autoFocus = false,
    closeOnInteractOutside = true,
    modal = false,
    // lazyMount and unmountOnExit are handled via forceMount on Portal/Content
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lazyMount: _lazyMount,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unmountOnExit: _unmountOnExit,
  } = props;

  // Merge default positioning with user positioning
  const mergedPositioning: Positioning = {
    placement: 'bottom-start',
    overflowPadding: 4,
    ...positioning,
    offset: {
      mainAxis: 4,
      ...positioning?.offset,
    },
  };

  const { side, align } = parsePlacement(mergedPositioning.placement);

  const positioningValue = React.useMemo<PopoverPositioning>(() => ({
    side,
    align,
    sideOffset: mergedPositioning.offset?.mainAxis ?? 4,
    alignOffset: mergedPositioning.offset?.crossAxis ?? 0,
    collisionPadding: mergedPositioning.overflowPadding ?? 4,
    autoFocus,
    closeOnInteractOutside,
  }), [
    side, align,
    mergedPositioning.offset?.mainAxis, mergedPositioning.offset?.crossAxis,
    mergedPositioning.overflowPadding, autoFocus, closeOnInteractOutside,
  ]);

  // Bridge Chakra-style onOpenChange ({ open }) to Radix (open)
  const handleOpenChange = React.useCallback((isOpen: boolean) => {
    onOpenChange?.({ open: isOpen });
  }, [ onOpenChange ]);

  return (
    <PositioningContext.Provider value={ positioningValue }>
      <RadixPopover.Root
        open={ open }
        defaultOpen={ defaultOpen }
        onOpenChange={ handleOpenChange }
        modal={ modal }
      >
        { children }
      </RadixPopover.Root>
    </PositioningContext.Provider>
  );
};

// --- PopoverTrigger ---

export interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  readonly asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(function PopoverTrigger(props, ref) {
  const { asChild = true, ...rest } = props;
  return <RadixPopover.Trigger asChild={ asChild } ref={ ref } { ...rest }/>;
});

// --- PopoverContent ---

export interface PopoverContentProps extends React.ComponentPropsWithoutRef<'div'> {
  readonly portalled?: boolean;
  readonly portalRef?: React.RefObject<HTMLElement>;
}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(function PopoverContent(props, ref) {
  const { portalled = true, portalRef, className, ...rest } = props;
  const positioning = React.useContext(PositioningContext);

  const preventFocus = React.useCallback((e: Event) => e.preventDefault(), []);
  const preventInteract = React.useCallback((e: Event) => e.preventDefault(), []);

  const content = (
    <RadixPopover.Content
      ref={ ref }
      side={ positioning.side }
      align={ positioning.align }
      sideOffset={ positioning.sideOffset }
      alignOffset={ positioning.alignOffset }
      collisionPadding={ positioning.collisionPadding }
      onOpenAutoFocus={ positioning.autoFocus ? undefined : preventFocus }
      onInteractOutside={ positioning.closeOnInteractOutside ? undefined : preventInteract }
      className={ cn(
        'z-50 rounded-lg border border-[var(--color-popover-border,var(--color-border-divider))]',
        'bg-[var(--color-popover-bg,var(--colors-dialog-bg))]',
        'shadow-[var(--shadow-popover,var(--shadow-lg))]',
        'outline-none',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      ) }
      { ...rest }
    />
  );

  if (!portalled) {
    return content;
  }

  return (
    <RadixPopover.Portal container={ portalRef?.current ?? undefined }>
      { content }
    </RadixPopover.Portal>
  );
});

// --- PopoverArrow ---

export interface PopoverArrowProps extends React.ComponentPropsWithoutRef<'svg'> {}

export const PopoverArrow = React.forwardRef<
  SVGSVGElement,
  PopoverArrowProps
>(function PopoverArrow(props, ref) {
  const { className, ...rest } = props;
  return (
    <RadixPopover.Arrow
      ref={ ref }
      className={ cn('fill-[var(--color-popover-bg,var(--colors-dialog-bg))]', className) }
      { ...rest }
    />
  );
});

// --- PopoverCloseTrigger ---

export interface PopoverCloseTriggerProps extends React.ComponentPropsWithoutRef<'button'> {}

export const PopoverCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverCloseTriggerProps
>(function PopoverCloseTrigger(props, ref) {
  const { className, ...rest } = props;
  return (
    <RadixPopover.Close
      className={ cn('absolute top-1 right-1', className) }
      { ...rest }
      asChild
      ref={ ref }
    >
      <CloseButton/>
    </RadixPopover.Close>
  );
});

// --- PopoverCloseTriggerWrapper ---

export interface PopoverCloseTriggerWrapperProps extends React.ComponentPropsWithoutRef<'button'> {
  readonly disabled?: boolean;
}

export const PopoverCloseTriggerWrapper = React.forwardRef<
  HTMLButtonElement,
  PopoverCloseTriggerWrapperProps
>(function PopoverCloseTriggerWrapper(props, ref) {
  const { disabled, children, ...rest } = props;

  if (disabled) {
    return children as React.ReactElement;
  }

  return (
    <RadixPopover.Close ref={ ref } { ...rest } asChild>
      { children }
    </RadixPopover.Close>
  );
});

// --- Simple wrapper components ---

export interface PopoverBodyProps extends React.ComponentPropsWithoutRef<'div'> {}

export const PopoverBody = React.forwardRef<
  HTMLDivElement,
  PopoverBodyProps
>(function PopoverBody(props, ref) {
  const { className, ...rest } = props;
  return (
    <div
      ref={ ref }
      className={ cn('p-4', className) }
      { ...rest }
    />
  );
});

export interface PopoverHeaderProps extends React.ComponentPropsWithoutRef<'div'> {}

export const PopoverHeader = React.forwardRef<
  HTMLDivElement,
  PopoverHeaderProps
>(function PopoverHeader(props, ref) {
  const { className, ...rest } = props;
  return (
    <div
      ref={ ref }
      className={ cn('px-4 pt-4 pb-0 font-semibold', className) }
      { ...rest }
    />
  );
});

export interface PopoverFooterProps extends React.ComponentPropsWithoutRef<'div'> {}

export const PopoverFooter = React.forwardRef<
  HTMLDivElement,
  PopoverFooterProps
>(function PopoverFooter(props, ref) {
  const { className, ...rest } = props;
  return (
    <div
      ref={ ref }
      className={ cn('px-4 pb-4 pt-0', className) }
      { ...rest }
    />
  );
});

export interface PopoverTitleProps extends React.ComponentPropsWithoutRef<'h3'> {}

export const PopoverTitle = React.forwardRef<
  HTMLHeadingElement,
  PopoverTitleProps
>(function PopoverTitle(props, ref) {
  const { className, ...rest } = props;
  return (
    <h3
      ref={ ref }
      className={ cn('text-base font-semibold', className) }
      { ...rest }
    />
  );
});

export interface PopoverDescriptionProps extends React.ComponentPropsWithoutRef<'p'> {}

export const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  PopoverDescriptionProps
>(function PopoverDescription(props, ref) {
  const { className, ...rest } = props;
  return (
    <p
      ref={ ref }
      className={ cn('text-sm', className) }
      { ...rest }
    />
  );
});
