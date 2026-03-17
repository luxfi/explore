import * as RadixDialog from '@radix-ui/react-dialog';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

import { CloseButton } from './close-button';

// ─── DrawerRoot ──────────────────────────────────────────────────────

export interface DrawerRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  initialFocusEl?: (() => HTMLElement | null) | React.RefObject<HTMLElement>;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
  modal?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const DrawerPlacementContext = React.createContext<string>('right');
const DrawerSizeContext = React.createContext<string>('md');

export const DrawerRoot = (props: DrawerRootProps) => {
  const {
    children,
    open,
    defaultOpen,
    onOpenChange,
    placement = 'right',
    initialFocusEl: _initialFocusEl,
    lazyMount: _lazyMount,
    unmountOnExit: _unmountOnExit,
    modal = true,
    size = 'md',
  } = props;

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    onOpenChange?.({ open: nextOpen });
  }, [ onOpenChange ]);

  return (
    <DrawerPlacementContext.Provider value={ placement }>
      <DrawerSizeContext.Provider value={ size }>
        <RadixDialog.Root
          open={ open }
          defaultOpen={ defaultOpen }
          onOpenChange={ handleOpenChange }
          modal={ modal }
        >
          { children }
        </RadixDialog.Root>
      </DrawerSizeContext.Provider>
    </DrawerPlacementContext.Provider>
  );
};

// ─── DrawerContent ───────────────────────────────────────────────────

export interface DrawerContentProps extends React.ComponentPropsWithoutRef<'div'> {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  offset?: string | number;
  backdrop?: boolean;
}

const PLACEMENT_CLASSES: Record<string, string> = {
  right: 'inset-y-0 right-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
  left: 'inset-y-0 left-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left',
  top: 'inset-x-0 top-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-top data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top',
  bottom: 'inset-x-0 bottom-0 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom',
};

const SIZE_CLASSES: Record<string, Record<string, string>> = {
  right: { xs: 'w-60', sm: 'w-80', md: 'w-96', lg: 'w-[480px]', xl: 'w-[640px]', full: 'w-screen' },
  left: { xs: 'w-60', sm: 'w-80', md: 'w-96', lg: 'w-[480px]', xl: 'w-[640px]', full: 'w-screen' },
  top: { xs: 'h-40', sm: 'h-60', md: 'h-80', lg: 'h-96', xl: 'h-[480px]', full: 'h-screen' },
  bottom: { xs: 'h-40', sm: 'h-60', md: 'h-80', lg: 'h-96', xl: 'h-[480px]', full: 'h-screen' },
};

export const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent(props, ref) {
    const { children, portalled = true, portalRef, offset: _offset, backdrop = true, className, ...rest } = props;
    const placement = React.useContext(DrawerPlacementContext);
    const size = React.useContext(DrawerSizeContext);

    const content = (
      <>
        { backdrop && (
          <RadixDialog.Overlay
            className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          />
        ) }
        <RadixDialog.Content
          ref={ ref }
          className={ cn(
            'fixed z-50 flex flex-col bg-[var(--color-drawer-bg)] shadow-[var(--shadow-drawer)] duration-300',
            PLACEMENT_CLASSES[placement] ?? PLACEMENT_CLASSES.right,
            SIZE_CLASSES[placement]?.[size] ?? SIZE_CLASSES.right?.md,
            className,
          ) }
          { ...rest }
        >
          { children }
        </RadixDialog.Content>
      </>
    );

    if (portalled) {
      return (
        <RadixDialog.Portal container={ portalRef?.current ?? undefined }>
          { content }
        </RadixDialog.Portal>
      );
    }

    return content;
  },
);

// ─── DrawerCloseTrigger ──────────────────────────────────────────────

export const DrawerCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(function DrawerCloseTrigger(props, ref) {
  return (
    <RadixDialog.Close asChild>
      <CloseButton
        ref={ ref }
        className={ cn('absolute top-7 right-5', props.className) }
        { ...props }
      />
    </RadixDialog.Close>
  );
});

// ─── DrawerTrigger ───────────────────────────────────────────────────

export const DrawerTrigger = (props: React.ComponentPropsWithoutRef<typeof RadixDialog.Trigger>) => {
  const { asChild = true, ...rest } = props;
  return <RadixDialog.Trigger asChild={ asChild } { ...rest }/>;
};

// ─── Sub-components ──────────────────────────────────────────────────

export const DrawerHeader = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function DrawerHeader({ className, ...props }, ref) {
    return <div ref={ ref } className={ cn('flex flex-col gap-1.5 p-6 pb-0', className) } { ...props }/>;
  },
);

export const DrawerBody = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function DrawerBody({ className, ...props }, ref) {
    return <div ref={ ref } className={ cn('flex-1 overflow-auto p-6', className) } { ...props }/>;
  },
);

export const DrawerFooter = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function DrawerFooter({ className, ...props }, ref) {
    return <div ref={ ref } className={ cn('flex items-center justify-end gap-2 p-6 pt-0', className) } { ...props }/>;
  },
);

export const DrawerTitle = RadixDialog.Title;
export const DrawerDescription = RadixDialog.Description;
export const DrawerActionTrigger = RadixDialog.Close;
