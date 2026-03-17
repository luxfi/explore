import * as RadixDialog from '@radix-ui/react-dialog';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

import { BackToButton } from '../components/buttons/BackToButton';
import { CloseButton } from './close-button';

// ---------------------------------------------------------------------------
// Size / context
// ---------------------------------------------------------------------------

type DialogSize = 'sm' | 'md' | 'full' | 'cover';

/**
 * Responsive size expressed as a plain value or a breakpoint map.
 * Mirrors the Chakra `size={{ lgDown: 'full', lg: 'md' }}` pattern.
 * Responsive behavior is implemented via Tailwind responsive variants at
 * the CSS-class level (see `sizeClasses` helper below).
 */
type ResponsiveSize = DialogSize | { base?: DialogSize; lgDown?: DialogSize; lg?: DialogSize };

interface DialogContextValue {
  size: ResponsiveSize;
}

const DialogContext = React.createContext<DialogContextValue>({ size: 'md' });

function useDialogContext(): DialogContextValue {
  return React.useContext(DialogContext);
}

// ---------------------------------------------------------------------------
// Tailwind class helpers
// ---------------------------------------------------------------------------

const CONTENT_SIZE_MAP: Record<DialogSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[728px]',
  full: 'max-w-[100vw] min-h-dvh rounded-none [--dialog-margin:0]',
  cover: 'w-full h-full [--dialog-margin:0]',
};

/**
 * Resolve a `ResponsiveSize` into a Tailwind class string.
 *
 * For a plain value we return the matching static class.  For a breakpoint
 * object we compose mobile-first responsive classes.  The Tailwind config in
 * this project defines `lg: 1000px` as breakpoint — that aligns with Chakra's
 * `lgDown` / `lg` pattern.
 */
function sizeClasses(size: ResponsiveSize): string {
  if (typeof size === 'string') {
    return CONTENT_SIZE_MAP[size];
  }

  const parts: Array<string> = [];

  // "base" or "lgDown" both apply below lg
  const small = size.base ?? size.lgDown;
  if (small) {
    parts.push(CONTENT_SIZE_MAP[small]);
  }

  if (size.lg) {
    // Prefix each class with `lg:` for the large breakpoint
    const lgClasses = CONTENT_SIZE_MAP[size.lg]
      .split(' ')
      .map((c) => `lg:${ c }`)
      .join(' ');
    parts.push(lgClasses);
  }

  return parts.join(' ');
}

// ---------------------------------------------------------------------------
// DialogRoot
// ---------------------------------------------------------------------------

export interface DialogRootProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  size?: ResponsiveSize;

  /** Accepted for API compat but not implemented — animations are CSS-only. */
  motionPreset?: string;
  modal?: boolean;
}

export const DialogRoot: React.FC<DialogRootProps> = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  size = 'md',
  modal = true,
  // motionPreset is intentionally unused — kept for API compat
}) => {
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.({ open: nextOpen });
    },
    [ onOpenChange ],
  );

  const ctx = React.useMemo<DialogContextValue>(() => ({ size }), [ size ]);

  return (
    <DialogContext.Provider value={ ctx }>
      <RadixDialog.Root
        open={ open }
        defaultOpen={ defaultOpen }
        onOpenChange={ handleOpenChange }
        modal={ modal }
      >
        { children }
      </RadixDialog.Root>
    </DialogContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// DialogContent
// ---------------------------------------------------------------------------

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  backdrop?: boolean;
}

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(function DialogContent(props, ref) {
  const {
    children,
    portalled = true,
    portalRef,
    backdrop = true,
    className,
    ...rest
  } = props;

  const { size } = useDialogContext();

  let portalProps: RadixDialog.DialogPortalProps;
  if (!portalled) {
    portalProps = { container: undefined };
  } else if (portalRef) {
    portalProps = { container: portalRef.current };
  } else {
    portalProps = {};
  }

  // When portalled=false we skip the Radix Portal wrapper entirely
  const Wrapper = portalled ? RadixDialog.Portal : React.Fragment;
  const wrapperProps = portalled ? portalProps : {};

  return (
    <Wrapper { ...wrapperProps }>
      { backdrop && (
        <RadixDialog.Overlay
          className="fixed inset-0 z-[1400] bg-black/80"
        />
      ) }
      { /* Positioner — centers the content panel */ }
      <div
        className={ cn(
          'fixed inset-0 z-[1400] flex w-screen h-dvh',
          'items-start lg:items-center justify-center',
          'overflow-hidden',
        ) }
      >
        <RadixDialog.Content
          ref={ ref }
          className={ cn(
            // Base content styles
            'relative flex flex-col w-full p-6 outline-none text-base',
            'bg-dialog-bg text-dialog-fg shadow-lg rounded-xl',
            'my-[var(--dialog-margin,var(--dialog-base-margin))]',
            'mx-auto [--dialog-base-margin:4rem] lg:[--dialog-base-margin:auto]',
            'max-h-[calc(100%-7.5rem)] overflow-hidden',
            // Size variant
            sizeClasses(size),
            className,
          ) }
          { ...rest }
        >
          { children }
        </RadixDialog.Content>
      </div>
    </Wrapper>
  );
});

// ---------------------------------------------------------------------------
// DialogCloseTrigger
// ---------------------------------------------------------------------------

export interface DialogCloseTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DialogCloseTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogCloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
  const { className, ...rest } = props;

  return (
    <RadixDialog.Close asChild>
      <CloseButton ref={ ref } className={ className } { ...rest }>
        { props.children }
      </CloseButton>
    </RadixDialog.Close>
  );
});

// ---------------------------------------------------------------------------
// DialogHeader
// ---------------------------------------------------------------------------

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  startElement?: React.ReactNode;
  onBackToClick?: () => void;
}

export const DialogHeader = React.forwardRef<
  HTMLDivElement,
  DialogHeaderProps
>(function DialogHeader(props, ref) {
  const { startElement: startElementProp, onBackToClick, className, children, ...rest } = props;

  const startElement =
    startElementProp ?? (onBackToClick ? <BackToButton onClick={ onBackToClick }/> : undefined);

  return (
    <div
      ref={ ref }
      className={ cn(
        'flex-none p-0 mb-2 flex items-center gap-x-2 min-h-[40px]',
        className,
      ) }
      { ...rest }
    >
      { startElement }
      <RadixDialog.Title
        className={ cn(
          'text-base lg:text-lg font-medium',
          'whitespace-nowrap overflow-hidden text-ellipsis',
        ) }
      >
        { children }
      </RadixDialog.Title>
      <DialogCloseTrigger className="ml-auto"/>
    </div>
  );
});

// ---------------------------------------------------------------------------
// DialogBody
// ---------------------------------------------------------------------------

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogBody = React.forwardRef<
  HTMLDivElement,
  DialogBodyProps
>(function DialogBody({ className, ...props }, ref) {
  return (
    <div
      ref={ ref }
      className={ cn('flex-1 p-0 overflow-auto', className) }
      { ...props }
    />
  );
});

// ---------------------------------------------------------------------------
// DialogFooter
// ---------------------------------------------------------------------------

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = React.forwardRef<
  HTMLDivElement,
  DialogFooterProps
>(function DialogFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ ref }
      className={ cn('flex items-center justify-start gap-6 p-0 mt-6', className) }
      { ...props }
    />
  );
});

// ---------------------------------------------------------------------------
// Simple wrappers that re-export Radix primitives under the old names
// ---------------------------------------------------------------------------

export const DialogBackdrop = RadixDialog.Overlay;

export const DialogTitle = RadixDialog.Title;

export const DialogDescription = RadixDialog.Description;

export interface DialogTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixDialog.Trigger> {}

export const DialogTrigger = RadixDialog.Trigger;

/**
 * `DialogActionTrigger` renders its child and closes the dialog on click.
 * This mirrors the Chakra `Dialog.ActionTrigger` behavior which wraps
 * children in a close action.
 */
export const DialogActionTrigger = RadixDialog.Close;
